import express from "express";

let grammarRouter = express.Router();

grammarRouter.post('/status', function (req, res, next) {
    res.send('OK');
});

export default grammarRouter;