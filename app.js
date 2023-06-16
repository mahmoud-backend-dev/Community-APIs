
require('express-async-errors');
require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 1812;
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
// Setting Security For App
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const errorHandler = require('./middleware/error-handler');
const notFoundErr = require('./middleware/notFoundMiddleware');
const connectDB = require('./db/connectDB');
const mountRoutes = require('./routes');


// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// Compress all responses
app.use(compression());

// for Swagger Ui StartUp an running live server
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

// To remove data using these defaults, To apply data sanitization
// nosql mongo injection
app.use(mongoSanitize());
// To sanitize user input coming from POST body, GET queries, and url params  ex: '<script></script>' to convert string ''&lt;script>&lt;/script>''
app.use(xss())


// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100, 
    message:
    'Too many accounts created from this IP, please try again after an 15 minutes'
})

// Apply the rate limiting middleware to all requests
app.use(limiter)


// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());


app.set('SocketIO', io)

// Mount Api
mountRoutes(app);

app.use(errorHandler);
app.use(notFoundErr);



const start = async () => {
    try {
        await connectDB(process.env.URI);
        httpServer.listen(port, () => console.log(`Listen server on http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();