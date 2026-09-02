const foodDict = {
  Apple: { tr: 'Elma', en: 'Apple' },
  Banana: { tr: 'Muz', en: 'Banana' },
  Pasta: { tr: 'Makarna', en: 'Pasta' },
  'Chicken Breast': { tr: 'Tavuk Göğsü', en: 'Chicken Breast' },
  'White Bread': { tr: 'Beyaz Ekmek', en: 'White Bread' },
  'Whole Milk': { tr: 'Tam Yağlı Süt', en: 'Whole Milk' },
  'Boiled Egg': { tr: 'Haşlanmış Yumurta', en: 'Boiled Egg' },
  'White Rice': { tr: 'Pirinç Pilavı', en: 'White Rice' },
  Oatmeal: { tr: 'Yulaf Ezmesi', en: 'Oatmeal' },
  'Greek Yogurt': { tr: 'Süzme Yoğurt', en: 'Greek Yogurt' },
  'Grilled Salmon': { tr: 'Izgara Somon', en: 'Grilled Salmon' },
  'Olive Oil': { tr: 'Zeytinyağı', en: 'Olive Oil' },
  Tomato: { tr: 'Domates', en: 'Tomato' },
  Cucumber: { tr: 'Salatalık', en: 'Cucumber' },
  Potato: { tr: 'Patates', en: 'Potato' },
  'Beef Steak': { tr: 'Dana Biftek', en: 'Beef Steak' },
  Almonds: { tr: 'Badem', en: 'Almonds' },
  Walnuts: { tr: 'Ceviz', en: 'Walnuts' },
  'Cheddar Cheese': { tr: 'Kaşar Peyniri', en: 'Cheddar Cheese' },
  'Coffee (Black)': { tr: 'Sade Kahve', en: 'Coffee (Black)' },
  Milk: { tr: 'Süt', en: 'Milk' },
  'Flour products': { tr: 'Unlu mamuller', en: 'Flour products' },
  Beef: { tr: 'Sığır eti', en: 'Beef' },
  Pork: { tr: 'Domuz eti', en: 'Pork' },
  'Red meat': { tr: 'Kırmızı et', en: 'Red meat' },
  'Dairy products': { tr: 'Süt ürünleri', en: 'Dairy products' },
  Beans: { tr: 'Fasulye', en: 'Beans' },
  Wheat: { tr: 'Buğday', en: 'Wheat' },
  Chicken: { tr: 'Tavuk', en: 'Chicken' },
  Corn: { tr: 'Mısır', en: 'Corn' },
  Peanuts: { tr: 'Yer fıstığı', en: 'Peanuts' },
  Sesame: { tr: 'Susam', en: 'Sesame' },
  'Smoked meats': { tr: 'Tütsülenmiş etler', en: 'Smoked meats' },
  Alcohol: { tr: 'Alkol', en: 'Alcohol' },
  Caffeine: { tr: 'Kafein', en: 'Caffeine' },
  'Preserved foods': { tr: 'Konserve gıdalar', en: 'Preserved foods' },
  Eggplant: { tr: 'Patlıcan', en: 'Eggplant' },
  'Poultry meat': { tr: 'Kümes hayvanı eti', en: 'Poultry meat' },
  Bread: { tr: 'Ekmek', en: 'Bread' },
  Nut: { tr: 'Fındık/Fıstık', en: 'Nut' },
  'Pork meat': { tr: 'Domuz eti', en: 'Pork meat' }
};

export const getLocalizedFoodName = (item, language = 'tr') => {
  if (!item) return '';
  const lang = String(language).startsWith('tr') ? 'tr' : 'en';
  if (typeof item === 'object') {
    if (item.name) {
      if (typeof item.name === 'object') return item.name[lang] || item.name.tr || item.name.en || '';
      if (typeof item.name === 'string') {
        const found = foodDict[item.name];
        return found ? (found[lang] || item.name) : item.name;
      }
    }
    if (item.title) {
      if (typeof item.title === 'object') return item.title[lang] || item.title.tr || item.title.en || '';
      if (typeof item.title === 'string') {
        const found = foodDict[item.title];
        return found ? (found[lang] || item.title) : item.title;
      }
    }
    return '';
  }
  const str = String(item);
  const found = foodDict[str];
  return found ? (found[lang] || str) : str;
};

export default getLocalizedFoodName;
