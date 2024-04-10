import express from "express";
import Routes from "../routes/index.js";
import Logger from "rklogger";

class ExpressService {
    /**
     * Initialise Express Service
     * @param cb
     */
    initialBackend(cb) {
        let app = express();
        app.disable('x-powered-by');
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        Routes.setRoutes(app);
        let server = app.listen(3333);
        Logger.printInfo("Express Service Initialised");
        cb(true);
    }
}

const RestService = new ExpressService();
export default RestService;