import Services from "./services/index.js";
import 'dotenv/config';
import Logger from "rklogger"

Services.ExpressService.initialBackend((cb) => {
    if (cb) {
        Logger.printInfo("Backend Fully Initialised");
    }
});