const express = require('express');
const Order = require('../models/order.model');
const router = express.Router();

router.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ success: true });
});

router.get('/current-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});


router.post('/add-order', async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ success: false, error: 'No information sent.' })
      return;
    }

    if (!req.body.order_item) {
      res.status(400).json({ success: false, error: 'No order item sent.' });
      return;
    }

    if (!req.body.quantity) {
      res.status(400).json({ success: false, error: 'No quantity sent.' })
      return;
    }

    const orderObj = new Order({
      order_item: req.body.order_item,
      quantity: req.body.quantity,
      ordered_by: req.body.ordered_by,
    });

    const dbResponse = await orderObj.save();
    if (dbResponse && dbResponse._id) {
      res.status(200).json({ success: true, insertedId: dbResponse._id });
    } else {
      res.status(400).json({ success: false, error: 'Database Error' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post('/edit-order', async (req, res) => {
  // expects id
  try {
    if (!req.body.id) {
      res.status(400).json({ success: false, error: 'No id supplied' });
      return;
    }

    // make sure an order exists in the database with that id
    const targetOrder = await Order.findOne({ _id: req.body.id });
    if (!targetOrder) {
      res.status(400).json({ success: false, error: 'No order exists with that id!' });
      return;
    }

    const updateResponse = await Order.updateOne({
      _id: req.body.id
    }, {
      ordered_by: req.body.ordered_by,
      order_item: req.body.order_item,
      quantity: req.body.quantity,
    });

    if (!updateResponse || !updateResponse.nModified) {
      res.status(400).json({ success: false, error: 'Error in database while updating' });
      return;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post('/delete-order', async (req, res) => {
  try {
    // expects id
    if (!req.body.id) {
      res.status(400).json({ success: false, error: 'No id supplied' });
      return;
    }

    const deleteResponse = await Order.deleteOne({ _id: req.body.id });
    if (!deleteResponse) {
      res.status(400).json({ success: false, error: 'Item was not found in the database with given id' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    // HITTING THIS ENDPOINT DELETES ALL ORDERS
    const deleteResponse = await Order.deleteMany({});
    if (!deleteResponse) {
      res.status(400).json({ success: false, error: 'Error deleting all orders.' });
      return;
    }
    res.status(200).json({ success: true, deleted: deleteResponse.n });

  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(204).json({ success: false, error: "Item was not found in the database" });
  }

  return res.status(200).json({
    success: true,
    order_item: order.order_item,
    quantity: order.quantity
  });

});

module.exports = router;
