import express from "express";

let mainRouter = express.Router();

mainRouter.get('/status', function (req, res, next) {
    res.send('OK');
});

mainRouter.post('/status', function (req, res, next) {
    res.send('POST OK');
});

export default mainRouter;
