
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { Product } = require('../../models/product');

router.get('/', auth, async (req, res, next) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: 'Search parameter is required' });
    }

    const products = await Product.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { "title.tr": { $regex: search, $options: 'i' } },
        { "title.en": { $regex: search, $options: 'i' } },
        { "title.ru": { $regex: search, $options: 'i' } },
        { "title.ua": { $regex: search, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
