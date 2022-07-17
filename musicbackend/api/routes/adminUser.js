const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/adminUser");
const Product = require("../models/songs");

// Handle incoming GET requests to /orders
router.get("/", (req, res, next) => {
  Order.find()
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            user_name: doc.user_name,
            password: doc.password,
            Email: doc.Email,
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "adminUser Get",
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        user_name: req.body.user_name,
        password: req.body.password,
        Email: req.body.Email,
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "adminUser stored",
        createdOrder: {
          _id: result._id,
          user_name: result.user_name,
          password: result.password,
          Email: result.Email,
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

router.get("/user_name", (req, res, next) => {
  const data = req.query.name;
  Order.find({ user_name: data })
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "adminUser not found"
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

router.get("/login/", (req, res, next) => {
  const data = req.query.name;
  Order.find({ user_name: data, password: req.query.password })
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "adminUser not found"
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
  Order.findByIdAndUpdate(req.params.id,req.body)
    .exec()
    .then(result => {
      console.log("result----------->", result.docs);
      res.status(200).json({
        id:req.params.id,
        result: req.body,
        message: "adminUser update",
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
        message: "adminUser deleted",
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
