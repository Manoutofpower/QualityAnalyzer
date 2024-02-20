import defaultRouter from './default.js'

const setRoutes = (app) => {
    app.use('/', defaultRouter)
}

export default {
    setRoutes
};