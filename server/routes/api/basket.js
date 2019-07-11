const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get items
router.get('/', async (req, res) => {
  const basket = await loadBasketItems();
  res.send(await basket.find({}).toArray());
});

// Add item
router.post('/', async (req, res) => {
  const basket = await loadBasketItems();
  await basket.insertOne({
    quantity: req.body.quantity,
    price: req.body.price
  });
  res.status(201).send();
});

// Delete Item
router.delete('/:id', async (req, res) => {
  const basket = await loadBasketItems();
  await basket.deleteOne({
    _id: new mongodb.ObjectID(req.params.id)
  });
  res.status(200).send();
});

async function loadBasketItems() {
  const client = await mongodb.MongoClient.connect('mongodb://ante:tada123@ds249127.mlab.com:49127/vue_store', {
    useNewUrlParser: true
  });

  return client.db('vue_store').collection('basket');
}

module.exports = router;