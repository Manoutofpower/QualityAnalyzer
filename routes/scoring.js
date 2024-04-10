import express from "express";
import Logger from "rklogger";
import APIHelper from "../helpers/api.js";
import scoreResult from "../data/score.js";

let scoringRouter = express.Router();

scoringRouter.post('/check', function (req, res, next) {
    Logger.printDebug("User Request POST: /check/status");
    const userAnswer = req.body.answer;

    APIHelper.checkGrammar(userAnswer, (cb) => {
        let scoreResponse = scoreResult;
        // TODO PROCESSING SCORE

        scoreResponse.autoCorrectionResult = cb.matches;
        res.json(scoreResponse);
    });

});

export default scoringRouter;