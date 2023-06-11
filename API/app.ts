import * as express from "express"
import { Request, Response, NextFunction } from "express"; 
import * as createError from "http-errors"
import { HttpError } from "http-errors";
import * as logger from "morgan"

const indexRouter = require('./routes/index');
const panoramaRouter = require('./routes/panoramas');

var app = express.default();

app.use(function(_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger.default('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('./public'));

app.use('/', indexRouter);
app.use('/panoramas', panoramaRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError[404]);
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((_req, res) => {
  // Invalid request
        res.json({
          error: {
            'name':'Error',
            'status':404,
            'message':'Invalid Request',
            'statusCode':404
          },
           message: 'Testing!'
        });
  });
module.exports = app;
