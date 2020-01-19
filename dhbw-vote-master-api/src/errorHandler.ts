export const errorHandler = (err: Error, req, res, next) => {
    if (res.headersSent === true) {
        return next(err);
    }
    res.status(500);
    res.render("error", { error: err.message });
};
