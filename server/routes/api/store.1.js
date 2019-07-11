const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Items
router.get('/', async (req, res) => {
  const store = await loadStoreItems();
  res.send(await store.find({}).toArray());
});

async function loadStoreItems() {
  const client = await mongodb.MongoClient.connect('mongodb://ante:tada123@ds249127.mlab.com:49127/vue_store', {
    useNewUrlParser: true
  });

  return client.db('vue_store').collection('store');
}

module.exports = router;