const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');
const Product = require("../models/artist");
const songs = require("../models/songs");
let avatar;

router.get("/", (req, res, next) => {
  Product.find()
    .populate('songs')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            artist_name: doc.artist_name,
            Email: doc.Email,
            artist_Image: doc.artist_Image,
            songs: doc.songs,
            _id: doc._id,
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/name/", (req, res, next) => {
  console.log("id----------->",req.query.name)
  const id = req.query.name;
  Product.find({artist_name:id})
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for artist ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  if (!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
  } else {
    console.log("file---------->",req.files.artist_Image)
    avatar = req.files.artist_Image;
    avatar.mv('./uploads/' + avatar.name);
  }
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    artist_name: req.body.artist_name,
    Email: req.body.Email,
    songs: req.body.songs,
    artist_Image: avatar.name
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created artist successfully",
        createdProduct: {
          _id: result._id,
          artist_name: result.artist_name,
          Email: result.Email,
          songs: result.songs,
          artist_Image: result.artist_Image,
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
router.get("/Images/", (req, res, next) => {
  const data = req.query.name;
  const path = `${data}`;
  console.log("path-------->",path);
  console.log("path------>",path);
  const stat = fs.statSync(path)
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
      'Content-Type': 'video/jpeg',
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

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          product: doc,

        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for artist ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.get("/name/", (req, res, next) => {
  const data = req.query.name;
  const path = `${data}`;
  const stat = fs.statSync(path)
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

router.put("/:id", (req, res, next) => {
  Product.findByIdAndUpdate(req.params.id, req.body)
      .exec()
      .then(result => {
          res.status(200).json({
              id: req.params.id,
              result: req.body,
              message: "artist update",
          });
      })
      .catch(err => {
          res.status(500).json({
              error: err
          });
      });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
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