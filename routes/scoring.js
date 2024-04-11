import express from "express";
import Logger from "rklogger";
import Helper from "../helpers/index.js";
import scoreResult from "../data/index.js";

let scoringRouter = express.Router();

scoringRouter.post('/check', function (req, res, next) {
    Logger.printDebug("User Request POST: /check/status");
    const userAnswer = req.body.answer;
    const topic = req.body.topic;

    Helper.APIHelper.checkGrammar(userAnswer, (cb) => {
        let error = cb.matches;
        let scoreResponse = scoreResult;
        scoreResponse.scoreResult.content = Helper.ScoreHelper.getContentScore(userAnswer, topic);
        scoreResponse.scoreResult.coherence = Helper.ScoreHelper.getCoherenceScore(userAnswer);
        scoreResponse.scoreResult.lexical = Helper.ScoreHelper.getLexicalScore(userAnswer);
        scoreResponse.scoreResult.grammar = Helper.ScoreHelper.getGrammarScore(error);
        scoreResponse.scoreResult.autoCorrectionResult = error;
        res.json(scoreResponse.scoreResult);
    });

});

export default scoringRouter;