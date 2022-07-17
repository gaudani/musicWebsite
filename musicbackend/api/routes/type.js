const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/type");
const Product = require("../models/type");

router.get("/", (req, res, next) => {
  Order.find()
    .populate("songs")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            Music_type: doc.Music_type,
            Image: doc.Image,
            songs: doc.songs,
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Playlist Get",
        error: err,
      });
    });
});

router.get("/type/", (req, res, next) => {
  const data = req.query.orderId;
  console.log("data----------------->", req.query.orderId);
  Order.find({ Music_type: data })
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Playlist not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
  } else {
    avatar = req.files.Image;
    avatar.mv("./uploads/" + avatar.name);
  }
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    Music_type: req.body.Music_type,
    songs: req.body.songs,
    Image: avatar.name,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created artist successfully",
        createdProduct: {
          _id: result._id,
          Music_type: result.Music_type,
          songs: result.songs,
          Image: result.Image,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("user_id")
    .populate("songs")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Playlist not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.put("/:id", (req, res, next) => {
  Order.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then((result) => {
      res.status(200).json({
        id: req.params.id,
        result: req.body,
        message: "Playlist update",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Playlist deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
