/// <reference path="./typings/tsd.d.ts"/>

import {Request, Response} from "express";
import * as mongoose from "mongoose";
import {IndexRouter} from "./routes/index-router";
import {AuthRouter} from "./routes/auth-router";
import {ProfileRouter} from "./routes/profile-router";
import {TaskPrototypeRouter} from "./routes/task-prototype-router";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
mongoose.Promise = global.Promise;

const connectionString = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/cosmos';

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('open', ()=> {
    console.log('i am happy');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', IndexRouter);
app.use('/auth', AuthRouter);
app.use('/profile', ProfileRouter);
app.use('/task', TaskPrototypeRouter);


// catch 404 and forward to error handler
app.use((req:Request, res:Response, next:Function) => {
    var err:any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err:any, req:Request, res:Response, next:Function) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err:any, req:Request, res:Response, next:Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
