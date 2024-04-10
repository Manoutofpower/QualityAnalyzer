import express from "express";
import Logger from "rklogger";
import APIHelper from "../helpers/api.js";

let grammarRouter = express.Router();

grammarRouter.post('/check', function (req, res, next) {
    Logger.printDebug("User Request POST: /check/status");
    const userAnswer = req.body.answer;

    APIHelper.checkGrammar(userAnswer, (cb) => {
        res.json(cb);
    });

});

export default grammarRouter;