import express from "express";
import Logger from "rklogger";

let mainRouter = express.Router();

mainRouter.get('/status', function (req, res, next) {
    Logger.printDebug("User Request GET: /status");
    res.send('OK');
});

mainRouter.post('/status', function (req, res, next) {
    Logger.printDebug("User Request POST: /status");
    res.send('OK');
});

export default mainRouter;