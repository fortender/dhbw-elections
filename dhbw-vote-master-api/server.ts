import fs from 'fs';
import express from 'express';
import cors from 'cors';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { errorHandler } from './errorHandler';

// Read config
const configFileBuffer = fs.readFileSync('config.json');
const config = JSON.parse(configFileBuffer.toString());
const secret = process.env.JWT_SECRET;

// ExpressJS init
const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(errorHandler)
    .use(cors());

// Routes

// Get users
app.route('/users').get(async (req, res) => {

});

// Create new user
app.route('/users').post(async (req, res) => {

});

/* Perform login
Request:
    {
        "username": "mail",
        "password": "password"
    }
Response:
    {
        jwt: ""
    }
*/
app.route('/users/login').post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(400).send({
            error: ''
        });
    }
});

app.route('/users/:mail').get(async (req, res) => {
    
});

// Get all candidates
app.route('/candidates').get(async (req, res) => {

});

// Get all elections
app.route('/elections').get(async (req, res) => {

});

// Create an election
app.route('/elections').post(async (req, res) => {

});

// Get election by id
app.route('/elections/:election_id').get(async (req, res) => {

});

// Get candidates for specific election
app.route('/election/:election_id/candidates').get(async (req, res) => {
    req.headers.authorization
});

// Vote for a specific candidate
app.route('/election/:election_id/candidates/:candidate_id/vote').post(async (req, res) => {
    
});

// Helper functions
function verifyToken(req) {
    if (!req.headers.authorization) {
    }
    const token = req.headers.authorization.replace('Bearer', '').trim();
    try {
        jwt.verify(token, secret)
    } catch(e) {
        if (e instanceof JsonWebTokenError) {
            
        } else {
            // Rethrow if any other error type
            throw e;
        }
    }
}