import defaultRouter from './default.js'
import userRouter from "./user.js";
import questionRouter from "./questions.js";
import scoringRouter from "./scoring.js";

const setRoutes = (app) => {
    app.use('/', defaultRouter);
    app.use('/question', questionRouter);
    app.use('/api', scoringRouter);
    app.use('/user', userRouter);
}
export default {
    setRoutes
};