
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { Day } = require('../../models/day');
const { Product } = require('../../models/product');

router.post('/day', auth, async (req, res, next) => {
  try {
    const { date, productId, weight } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const productTitle = typeof product.title === 'string' 
      ? product.title 
      : (product.title.en || product.title.ua || product.title.ru || 'Product');

    const eatenKcal = Math.round(((product.calories || 0) / 100) * weight);
    const eatenObj = {
      title: productTitle,
      weight,
      kcal: eatenKcal,
      id: productId
    };

    let day = await Day.findOne({ date, userId: req.user._id });
    
    if (!day) {
      day = await Day.create({
        date,
        userId: req.user._id,
        eatenProducts: [eatenObj],
      });
    } else {
      day.eatenProducts.push(eatenObj);
      await day.save();
    }
    
    const dailyRate = req.user.userData?.dailyRate || 0;
    const kcalConsumed = day.eatenProducts.reduce((acc, curr) => acc + curr.kcal, 0);
    const kcalLeft = dailyRate - kcalConsumed;
    const percentsOfDailyRate = dailyRate > 0 ? Math.round((kcalConsumed / dailyRate) * 100) : 0;
    
    day.daySummary = {
      date, kcalLeft, kcalConsumed, dailyRate, percentsOfDailyRate
    };
    await day.save();

    res.status(201).json({
      eatenProduct: eatenObj,
      daySummary: day.daySummary
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/day/:productId', auth, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const date = req.query?.date || req.body?.date;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const day = await Day.findOne({ date, userId: req.user._id });
    if (!day) return res.status(404).json({ message: 'Day not found' });
    
    const productIndex = day.eatenProducts.findIndex(p => String(p.id) === String(productId) || String(p._id) === String(productId));
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found in this day' });
    
    day.eatenProducts.splice(productIndex, 1);
    
    const dailyRate = req.user.userData?.dailyRate || 0;
    const kcalConsumed = day.eatenProducts.reduce((acc, curr) => acc + curr.kcal, 0);
    const kcalLeft = dailyRate - kcalConsumed;
    const percentsOfDailyRate = dailyRate > 0 ? Math.round((kcalConsumed / dailyRate) * 100) : 0;
    
    day.daySummary = {
      date, kcalLeft, kcalConsumed, dailyRate, percentsOfDailyRate
    };
    await day.save();

    res.json({ message: 'Product deleted', daySummary: day.daySummary });
  } catch (error) {
    next(error);
  }
});

router.post('/day/info', auth, async (req, res, next) => {
  try {
    const { date } = req.body;
    let day = await Day.findOne({ date, userId: req.user._id });
    
    const dailyRate = req.user.userData?.dailyRate || 0;

    if (!day) {
      return res.json({
        date,
        eatenProducts: [],
        daySummary: {
          date,
          kcalLeft: dailyRate,
          kcalConsumed: 0,
          dailyRate,
          percentsOfDailyRate: 0
        }
      });
    }

    res.json({
      date,
      eatenProducts: day.eatenProducts,
      daySummary: day.daySummary || { date, dailyRate, kcalConsumed: 0, kcalLeft: dailyRate }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
