const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./model/subscribers_model');

// Load Routes
const index = require('./router');

// subscriber route load push
const push = require('./router/push');

// subscriber route load
const subscribe = require('./router/subscriber');
// Load Keys
const keys = require('./config/keys');
//Handlebars Helpers

mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI, {})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//Create Express middleware
const app = express();
app.set('trust proxy', true);
// parse application/json
app.use(bodyParser.json({limit: '100mb'}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all((req,res,next) => {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'POST');
        return res.status(200).json({});
    }
    next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', __dirname + '/public/js');

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



// Use Routes

app.use('/', index);
app.use('/subscribe',cors(), subscribe);
app.use('/push', push);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});