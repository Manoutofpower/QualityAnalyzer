import express from "express";
import Routes from "../routes/index.js";

class ExpressService {
    initialBackend() {
        let app = express();
        app.disable('x-powered-by');
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        Routes.setRoutes(app);
        let server = app.listen(3333);
        console.log('Express Service Initialised');
    }
}

const RestService = new ExpressService();
export default RestService;