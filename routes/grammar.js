import express from "express";
import Logger from "rklogger";

let grammarRouter = express.Router();

grammarRouter.post('/check', function (req, res, next) {
    Logger.printDebug("User Request POST: /check/status");
    res.send('OK');
});

export default grammarRouter;
