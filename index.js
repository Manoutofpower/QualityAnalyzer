import Services from "./services/index.js";

Services.ExpressService.initialBackend((cb) => {
    if (cb) {
        console.log('Backend Fully Initialised');
    }
});