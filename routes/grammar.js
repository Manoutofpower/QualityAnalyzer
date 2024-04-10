import express from "express";

let grammarRouter = express.Router();

grammarRouter.post('/check', function (req, res, next) {
    res.send('OK');
});

export default grammarRouter;
