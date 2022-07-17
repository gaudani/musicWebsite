const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const getMP3Duration = require('get-mp3-duration')
let avatar;

const Product = require("../models/songs");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            music: doc.music,
            artistName: doc.artistName,
            _id: doc._id,
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/", (req, res, next) => {
  if (!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
  } else {
     avatar = req.files.music;
    avatar.mv('./videos/' + avatar.name);
  }
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    artistName: req.body.artistName,
    music: avatar.name
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created MUSIC successfully",
        createdProduct: {
          name: result.name,
          artistName: result.artistName,
          music: result.music,
          _id: result._id,
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/name/", (req, res, next) => {
  const data = req.query.name;
  const path = `videos/${data}`;
  const buffer = fs.readFileSync(path)
  const stat = fs.statSync(path)
  const duration = getMP3Duration(buffer);
  console.log("duration=====>",duration);
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});


router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'song deleted',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
