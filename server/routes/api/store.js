const express = require('express');
const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;

const router = express.Router();

// Get basket items
router.get('/basket', async (req, res) => {
  const basket = await loadBasketItems();
  res.send(await basket.find({}).toArray());
});

// Get store items
router.get('/', async (req, res) => {
  const store = await loadStoreItems();
  res.send(await store.find({}).toArray());
});

// Add basket item
router.post('/basket', async (req, res) => {
  const basket = await loadBasketItems();
  const item = await basket.findOne({
    name: req.body.name
  });
  if (item) {
    await basket.updateOne(
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

// Delete basket item
router.delete('/basket/:id', async (req, res) => {
  const basket = await loadBasketItems();
  const item = await basket.findOne({
    _id: new ObjectID(req.params.id)
  });
  if (item) {
    if (item.quantity > 1) {
      await basket.updateOne(
        { _id: item._id },
        { $set: { quantity: item.quantity - 1 } }
      );
    } else {
      await basket.deleteOne({
        _id: item._id
      });
    }
  }  
  res.sendStatus(200);
});

// Empty basket
router.delete('/basket', async(req, res) => {
  const basket = await loadBasketItems();
  await basket.remove({});
});

// Add store item
router.post('/', async (req, res) => {
  const store = await loadStoreItems(); 
  await store.insertOne({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price
  });    
  res.status(201).send();
});

async function loadBasketItems() {
  const client = await mongodb.MongoClient.connect('mongodb://ante:tada123@ds249127.mlab.com:49127/vue_store', {
    useNewUrlParser: true
  });

  return client.db('vue_store').collection('basket');
}

async function loadStoreItems() {
  const client = await mongodb.MongoClient.connect('mongodb://ante:tada123@ds249127.mlab.com:49127/vue_store', {
    useNewUrlParser: true
  });

  return client.db('vue_store').collection('store');
}

module.exports = router;