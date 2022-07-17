const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const cors = require('cors');
const songsRoutes = require("./api/routes/songs");
const orderRoutes = require("./api/routes/User");
const adminUser = require("./api/routes/adminUser");
const playlistRouter = require("./api/routes/playlist");
const artistRouter = require("./api/routes/artist");
const typemusic = require("./api/routes/type");

const mongoose = require('mongoose');
const connection = "mongodb://localhost:27017/musicmanagement";
mongoose.connect(connection, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
app.use(fileUpload({
  createParentPath: true,
  limits: { 
      fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
  },
}));


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/songs", songsRoutes);
app.use("/adminUser", adminUser);
app.use("/user", orderRoutes);
app.use("/playlist",playlistRouter);
app.use("/artist",artistRouter);
app.use("/typemusic",typemusic);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
