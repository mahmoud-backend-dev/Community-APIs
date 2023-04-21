const userRoute = require('./userRoute');
const postRoute = require('./postRoute')


const mountRoutes = (app) => {
  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/posts', postRoute);
}

module.exports = mountRoutes;