const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require("./Config");
const mongoose = require('mongoose')
const expressValidator = require("express-validator");
//const multer = require("multer");
const cookieParser = require("cookie-parser");
//const session = require("express-session");
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');

const path = require('path');
const app = express()

app.set('trust proxy', 1)

const port = config.APP_PORT || 4040
mongoose.connect(config.DB, {
    useNewUrlParser: true
})
app.listen(port);
console.log('App listening on port ' + port)

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors({
    origin: config.VIEW_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST']
}))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expressValidator());
app.use(cookieParser());
// const MemoryStore = require('session-memory-store')(session);
// app.use(
//     session({
//         name: 'amarsession',
//         secret: config.SECRET_KEY,
//         saveUninitialized: true,
//         resave: true,
//         store: new MemoryStore(),
//         cookie: {
//             secure: true,
//             maxAge: 60000
//         }
//     })
// );
app.use(cookieSession({
    name: 'amarsession',
    keys: [config.SECRET_KEY],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


const publicRoot = path.join(__dirname, '../../client/dist');
app.use(express.static(publicRoot));
app.get("/", (req, res, next) => {
    res.sendFile('index.html', {
        root: publicRoot
    });
});

const routes = require('./routes/Routes');
const auth = require('./routes/AuthRoutes');
const pages = require('./routes/PageRoutes');
app.use("/skill", routes);
app.use("/auth", auth);
app.use("/page", pages);

module.exports = app;