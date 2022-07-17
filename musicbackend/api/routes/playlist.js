const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/playlist");
const Product = require("../models/songs");

router.get("/", (req, res, next) => {
    Order.find()
        .populate('user_id')
        .populate('songs')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        user_id: doc.user_id,
                        songs: doc.songs,
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Playlist Get",
                error: err
            });
        });
});

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                user_id: req.body.user_id,
                songs: req.body.songs,
                // Email: req.body.Email,
                // product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Playlist stored",
                createdOrder: {
                    _id: result._id,
                    user_id: result.user_id,
                    songs: result.songs,
                    //   Email:result.Email,
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

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('user_id')
        .populate('songs')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "Playlist not found"
                });
            }
            res.status(200).json({
                order: order,
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.put("/:id", (req, res, next) => {
    console.log("req.params.id----------->", req.params.id);
    console.log("req........body---->", req.body);
    Order.findByIdAndUpdate(req.params.id, req.body)
        .exec()
        .then(result => {
            console.log("result----------->", result.docs);
            res.status(200).json({
                id: req.params.id,
                result: req.body,
                message: "Playlist update",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:orderId", (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Playlist deleted",
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
