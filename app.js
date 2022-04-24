require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");

// Routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const cubeRouter = require("./routes/cube");
const accessoryRouter = require("./routes/accessory");

const app = express();

// Mongo DB Connection
mongoose
   .connect(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then((res) => console.log("db connected"))
   .catch((err) => console.log(err));

// view engine setup
app.set("view engine", "hbs");
app.engine(
   "hbs",
   handlebars.engine({
      layoutDir: __dirname + "/view/layouts",
      partialsDir: __dirname + "/views/partials",
      extname: "hbs",
      defaultLayout: "main",
   })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Use routers
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", cubeRouter);
app.use("/", accessoryRouter);

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
   res.render("error");
});

module.exports = app;
