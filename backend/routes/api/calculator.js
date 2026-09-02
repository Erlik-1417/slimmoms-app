
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { Product } = require('../../models/product');
const { User } = require('../../models/user');

const calculateDailyRate = (weight, height, age, desiredWeight) => {
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight));
};

router.post('/public', async (req, res, next) => {
  try {
    const { weight, height, age, desiredWeight, bloodType = 1 } = req.body;

    const dailyRate = calculateDailyRate(weight, height, age, desiredWeight);
    
    const notAllowed = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true
    }).limit(10); 

    const notAllowedProducts = notAllowed.map(p => 
      typeof p.title === 'string' ? p.title : (p.title.tr || p.title.en || p.title.ua || p.title.ru || 'Product')
    );

    res.json({
      dailyRate,
      notAllowedProducts
    });
  } catch (error) {
    next(error);
  }
});

router.post('/private', auth, async (req, res, next) => {
  try {
    const { weight, height, age, desiredWeight, bloodType = 1 } = req.body;

    const dailyRate = calculateDailyRate(weight, height, age, desiredWeight);
    
    const notAllowed = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true
    }).limit(10);

    const notAllowedProducts = notAllowed.map(p => 
      typeof p.title === 'string' ? p.title : (p.title.tr || p.title.en || p.title.ua || p.title.ru)
    );

    const userDataObj = {
      weight, height, age, desiredWeight, bloodType, dailyRate, notAllowedProducts
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      userData: userDataObj
    }, { new: true });

    res.json({
      dailyRate,
      notAllowedProducts,
      userData: updatedUser.userData
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
