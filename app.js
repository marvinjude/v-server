const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const delay = require("express-delay");
const cors =  require("cors")

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

require("dotenv").config();

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((e) =>
    console.log(
      "🚫An error occured while connecting to Database. make sure you have the right connection string and mongodb is running on port 27017"
    )
  );

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(delay(1000, process.env.DELAY || 1200));
}
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
