import express from "express";

let userRouter = express.Router();

userRouter.post('/login', function (req, res, next) {
    //TODO: DATABASE CHECK
    res.json({status: 'OK', id: 123});
});

userRouter.post('/register', function (req, res, next) {
    //TODO: DATABASE INSERTION
    res.json({user: 'user', id: 123});
});

export default userRouter;