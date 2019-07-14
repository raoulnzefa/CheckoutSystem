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
  const item = await basket.findOne({
    name: req.body.name
  });
  if (item) {
    await basket.update(
      { _id: item._id },
      { $set: { quantity: item.quantity + 1 } }
    );
  } else {
    await basket.insertOne({
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      quantity: 1
    });
  }  
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