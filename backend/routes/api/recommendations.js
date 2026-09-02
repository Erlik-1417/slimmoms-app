
const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
  const { bloodType } = req.body;

  let notRecommended = [];

  const type = String(bloodType);

  if (type === "1") {
    notRecommended = [
      { name: "Milk", kcal: 42 },
      { name: "Flour products", kcal: 364 },
      { name: "Beef", kcal: 250 },
      { name: "Pork", kcal: 242 }
    ];
  } else if (type === "2") {
    notRecommended = [
      { name: "Red meat", kcal: 250 },
      { name: "Dairy products", kcal: 150 },
      { name: "Beans", kcal: 347 },
      { name: "Wheat", kcal: 339 }
    ];
  } else if (type === "3") {
    notRecommended = [
      { name: "Chicken", kcal: 239 },
      { name: "Corn", kcal: 86 },
      { name: "Peanuts", kcal: 567 },
      { name: "Sesame", kcal: 573 }
    ];
  } else if (type === "4") {
    notRecommended = [
      { name: "Smoked meats", kcal: 300 },
      { name: "Alcohol", kcal: 70 },
      { name: "Caffeine", kcal: 0 },
      { name: "Preserved foods", kcal: 120 }
    ];
  }

  res.json({ notRecommended });
});

module.exports = router;
