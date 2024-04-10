import express from "express";
import Logger from "rklogger";
import Helpers from "../helpers/index.js";

let questionRouter = express.Router();

questionRouter.post('/listing', function (req, res, next) {
    Logger.printDebug("User Request POST: /question/listing");
    Helpers.MySQLHelper.fetchQuestions((cb) => {
        if (cb) {
            res.json({status: 'OK', questions: cb});
        } else {
            res.json({status: 'ERROR'});
        }
    });
});

questionRouter.post('/practice', function (req, res, next) {
    Logger.printDebug("User Request POST: /question/practice");
    const quesID = req.body.quesID;
    if (quesID) {
        Helpers.MySQLHelper.getQuestion(quesID, (cb) => {
            if (cb) {
                res.json({status: 'OK', question: cb});
            } else {
                res.json({status: 'ERROR'});
            }
        });
    } else {
        res.json({status: 'ERROR'});
    }
});

export default questionRouter;