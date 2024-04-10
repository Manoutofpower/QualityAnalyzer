import express from "express";
import Logger from "rklogger";

let questionRouter = express.Router();

questionRouter.post('/listing', function (req, res, next) {
    //TODO: DATABASE CHECK
    Logger.printDebug("User Request POST: /question/listing");
    res.json({
        "category": "we", "questions": [{
            "quesID": "1", "quesTitle": "Study climate change"
        }, {
            "quesID": "2", "quesTitle": "Environment pollution"
        }, {
            "quesID": "3", "quesTitle": "Education"
        }, {
            "quesID": "4", "quesTitle": "Accomplishing goals"
        }, {
            "quesID": "5", "quesTitle": "Television"
        }, {
            "quesID": "6", "quesTitle": "Learning a new language"
        }, {
            "quesID": "7", "quesTitle": "Company's top-level authorities"
        }, {
            "quesID": "8", "quesTitle": "Compulsory voting"
        }]
    });
});

questionRouter.post('/practice', function (req, res, next) {
    //TODO: DATABASE INSERTION
    Logger.printDebug("User Request POST: /question/practice");
    const quesID = req.body.quesID;
    res.json({
        "quesID": "2",
        "quesTitle": "Environment pollution",
        "quesMain": "Write about environment pollution. Who is responsible: government, companies or industries?"
    });
});

export default questionRouter;