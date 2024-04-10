import express from "express";
import Logger from "rklogger";

let userRouter = express.Router();

userRouter.post('/login', function (req, res, next) {
    //TODO: DATABASE CHECK
    Logger.printDebug("User Request POST: /user/login");
    res.json({status: 'OK', id: 123});
});

userRouter.post('/register', function (req, res, next) {
    //TODO: DATABASE INSERTION
    Logger.printDebug("User Request POST: /user/register");
    res.json({user: 'user', id: 123});
});

export default userRouter;