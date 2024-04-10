import express from "express";
import Logger from "rklogger";
import Helpers from "../helpers/index.js";

let userRouter = express.Router();

userRouter.post('/login', function (req, res, next) {
    Logger.printDebug("User Request POST: /user/login");
    if (req.body.userName && req.body.userPassword) {
        Helpers.MySQLHelper.userLogin(req.body.userName, req.body.userPassword, (cb) => {
            if (cb && cb.length > 0) {
                res.json({status: 'OK', id: cb});
            } else {
                res.json({status: 'ERROR'});
            }
        });
    } else {
        res.json({status: 'ERROR'});
    }
});

userRouter.post('/register', function (req, res, next) {
    Logger.printDebug("User Request POST: /user/register");
    if (req.body.userName && req.body.userPassword) {
        Helpers.MySQLHelper.userRegister(req.body.userName, req.body.userPassword, (cb) => {
            if (cb) {
                res.json({status: 'OK'});
            } else {
                res.json({status: 'ERROR'});
            }
        });
    } else {
        res.json({status: 'ERROR'});
    }
});

export default userRouter;