import defaultRouter from './default.js'
import grammarRouter from "./grammar.js";
import userRouter from "./user.js";

const setRoutes = (app) => {
    app.use('/', defaultRouter);
    app.use('/check', grammarRouter);
    app.use('/user', userRouter);
}

export default {
    setRoutes
};