import compression from "compression";
import crypto from "crypto";
import express, { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import pg, { native } from "pg";

// Read config
/*
const configFileBuffer = fs.readFileSync("config.json");
const config = JSON.parse(configFileBuffer.toString());
*/
const secret = process.env.JWT_SECRET || "supersecret";

// Compression filter
const shouldCompress = (req, res) => {
    if (req.headers["x-no-compression"]) {
        return false;
    }
    return compression.filter(req, res);
};

// ExpressJS init
const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(compression({ filter: shouldCompress, threshold: 0 }))
    .use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        next();
    })
    .use((err, req: Request<any>, res: Response, next) => {
        console.error(err.message);
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).send(err.message);
    });

// Database
const pool = new pg.Pool({
    user: "election_admin",
    host: "192.168.10.153",
    database: "dhbw_elections",
    password: "admin",
});

// Get users
app.route("/users").get(expectAuth(async (req, res, next) => {
    return pool.query("select username from \"user\"").then(
        (result) => res.status(200).send({
            count: result.rowCount,
            users: result.rows,
        }),
        (error) => next(error),
    );
}));

// Create new user
app.route("/users").post(expectAuth(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if ((typeof username !== "string" && !(username instanceof String)) ||
        (typeof password !== "string" && !(password instanceof String))) {
        res.status(400).send({
            errorCode: "UserOrPasswordMissing",
            errorDescription: "username or password missing or malformed",
        });
        return;
    }
    const passwordHash = crypto
        .createHash("sha256", { encoding: "utf-8" })
        .update(password as string)
        .digest();
    const result = await pool.query(
        "insert into \"user\" (username, password_hash) values ($1, $2)",
        [username, passwordHash],
    );
    if (result.rowCount === 1) {
        res.status(200).send();
    } else {
        res.status(400).send({
            errorCode: "UsernameExists",
            errorDescription: "Username already exists",
        });
    }
}));

app.route("/users").put(expectAuth(async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if ((typeof oldPassword !== "string" && !(oldPassword instanceof String)) ||
        (typeof newPassword !== "string" && !(newPassword instanceof String))) {
        res.status(400).send({
            errorCode: "OldPasswordOrNewPasswordMissing",
            errorDescription: "Old or new password missing",
        });
        return;
    }
    const token = (req as any).token;
    const username: string = token.sub;
    let result = await pool.query("select password_hash from \"user\" where username = $1", [username]);
    const oldPasswordHashDb: Buffer = result.rows[0].password_hash;
    const oldPasswordHash: Buffer = crypto
        .createHash("sha256", { encoding: "utf-8" })
        .update(oldPassword as string)
        .digest();
    if (!oldPasswordHash.equals(oldPasswordHashDb)) {
        res.status(400).send({
            errorCode: "OldPasswordWrong",
            errorDescription: "Old password is wrong",
        });
        return;
    }
    const newPasswordHash: Buffer = crypto
        .createHash("sha256", { encoding: "utf-8" })
        .update(newPassword as string)
        .digest();
    result = await pool.query(
        "update \"user\" set password_hash = $2 where username = $1",
        [username, newPasswordHash],
    );
    if (result.rowCount === 1) {
        res.status(200).send();
    } else {
        res.status(500).send({
            errorCode: "SetPasswordHashError",
            errorDescription: "Error while attempting to update password in database",
        });
    }
}));

app.route("/users/login").post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check for malformed request or missing fields
    if ((typeof username !== "string" && !(username instanceof String)) ||
        (typeof password !== "string" && !(password instanceof String))) {
        res.status(400).send({
            errorCode: "MalformedLoginRequest",
            errorDescription: "username or password missing or malformed",
        });
        return;
    }

    // Authenticate
    const passwordHash = crypto
        .createHash("sha256", { encoding: "utf-8" })
        .update(password as string)
        .digest();

    const result = await pool.query("select password_hash from \"user\" where username = $1", [username]);
    if (result.rowCount === 0) {
        // Throw error
        res.status(401).send({
            errorCode: "UserNotFound",
            errorDescription: "User not found!",
        });
        return;
    }

    const passwordHashDb: Buffer = result.rows[0].password_hash;
    if (passwordHash.equals(passwordHashDb)) {
        // Return jwt
        const iat = Date.now();
        const exp = iat + 30 * 60 * 1000;
        const token: string =
            jwt.sign({
                sub: username,
                iat,
                exp,
            }, secret);
        res.status(200).send({
            token,
        });
    } else {
        res.status(401).send({
            error: "Username or password wrong!",
        });
    }
});

app.route("/users/:username").get(expectAuth(async (req, res) => {
    const result = await pool.query("select * from \"user\" where username = $1", [req.params.username]);
    res.status(200).send(result.rows[0]);
}));

// Get all candidates
app.route("/candidates").get(expectAuth(async (req, res) => {
    const result = await pool.query("select * from candidate");
    res.status(200).send({
        count: result.rowCount,
        result: result.rows,
    });
}));

// Get all elections
app.route("/elections").get(expectAuth(async (req, res, next) => {
    return pool.query("select * from election").then(
        (result) => res.status(200).send({
            count: result.rowCount,
            result: result.rows,
        }),
        (error) => next(error),
    );
}));

// Create an election
app.route("/elections").post(expectAuth(async (req, res) => {
    const query = "insert into election (start_date, end_date, info) values ($1, $2, $3) returning id";
    const result = await pool.query(query, [req.body.start_date, req.body.end_date, req.body.info]);
    if (result.rowCount === 1) {
        const electionId: number = result.rows[0].id;
        res.status(200).send({
            id: electionId,
        });
    } else {
        res.status(500).send({
            errorCode: "InsertElectionFailed",
            errorDescription: "Unable to insert new election into database",
        });
    }
}));

// Get election by id
app.route("/elections/:election_id").get(expectAuth(async (req, res) => {
    let result = await pool.query("select * from election where id = $1", [req.params.election_id]);
    if (result.rowCount === 0) {
        res.status(200).send({
            count: 0,
            result: [],
        });
        return;
    }

    const election = result.rows[0];
    const username = (req as any).token.sub;
    const electionId = req.params.election_id;
    result = await pool.query("select vote.id from vote inner join election_candidate on vote.election_candidate_id = election_candidate.id where (username = $1) and (election_id = $2)", [username, electionId]);
    if (result.rowCount > 0) {
        // User already voted -> add vote id
        election.voteId = result.rows[0].id;
    }
    res.status(200).send(election);
}));

app.route("/elections/:election_id/results").get(expectAuth(async (req, res) => {
    const query = "select * from candidate inner join (select candidate_id, count(*) as votes from election_candidate inner join vote on election_candidate.id = vote.election_candidate_id where election_id = $1 group by candidate_id) as t on candidate.id = t.candidate_id";
    const altQuery = "select vote.id as vote_id, candidate_id, first_name, last_name, voted_at from vote inner join election_candidate on vote.election_candidate_id = election_candidate.id inner join candidate on election_candidate.candidate_id = candidate.id where election_id = $1";
    const test = req.query.mode === "test";
    const view = req.query.view === "csv";
    const result = await pool.query(test ? altQuery : query, [req.params.election_id]);
    if (view) {
        const header = result.fields.map((field) => field.name);
        res.status(200).type("text/csv").send(
            `${header.join(";")}\n${result.rows.map((r) => Object.values(r).join(";")).join("\n")}`,
        );
    } else {
        res.status(200).send({
            count: result.rowCount,
            result: result.rows,
        });
    }
}));

// Get candidates for specific election
app.route("/elections/:election_id/candidates").get(expectAuth(async (req, res) => {
    const electionIdStr: string = req.params.election_id;
    const electionId: number = parseInt(electionIdStr, 10);
    const query = "select election_candidate.id, election_id, first_name, last_name, photo, info from election_candidate inner join candidate on election_candidate.candidate_id = candidate.id where election_id = $1";
    const result = await pool.query(query, [electionId]);
    res.status(200).send({
        count: result.rowCount,
        result: result.rows,
    });
}));

// Vote for a specific candidate
app.route("/elections/:election_id/candidates/:candidate_id/vote").post(expectAuth(async (req, res) => {
    const electionIdStr: string = req.params.election_id;
    const electionId: number = parseInt(electionIdStr, 10);
    const candidateIdStr: string = req.params.candidate_id;
    const candidateId: number = parseInt(candidateIdStr, 10);
    const username = (req as any).token.sub;
    let result = await pool.query("select 1 from vote inner join election_candidate on vote.election_candidate_id = election_candidate.id where (username = $1) and (election_id = $2)", [username, electionId]);
    if (result.rowCount > 0) {
        // Already voted
        res.status(400).send({
            errorCode: "ElectionAlreadyVoted",
            errorDescription: "You already voted",
        });
        return;
    }
    result = await pool.query("insert into vote (election_candidate_id, username) values ($1, $2) returning id", [candidateId, username]);
    res.status(200).send({
        voteId: result.rows[0].id,
    });
}));

app.get("*", async (req, res, next) => {
    const err = new Error(`Resource not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.listen(4000, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log("server is up and running on port 4000");
});

// Helper functions

function expectAuth(handler: (req: Request<any>, res: Response, next: any) => any): (req: Request<any>, res: Response, next: any) => any {
    return (req, res, next) => {
        if (verifyToken(req, res)) {
            handler(req, res, next);
        }
    };
}

function verifyToken(req, res): boolean {
    if (!req.headers.authorization) {
        res.status(401).send({
            error: "JWT missing in authorization header field",
        });
        return false;
    }
    const token = req.headers.authorization.replace("Bearer", "").trim();
    try {
        req.token = jwt.verify(token, secret, {
            clockTimestamp: Date.now(),
        });
        return true;
    } catch (e) {
        res.status(401).send({
            errorCode: "TokenVerificationError",
            errorDescription: (e as Error).message,
        });
    }
}
