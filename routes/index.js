import defaultRouter from './default.js'
import grammarRouter from "./grammar.js";
import userRouter from "./user.js";
import questionRouter from "./questions.js";

const setRoutes = (app) => {
    app.use('/', defaultRouter);
    app.use('/api', grammarRouter);
    app.use('/user', userRouter);
}

export default {
    setRoutes
};