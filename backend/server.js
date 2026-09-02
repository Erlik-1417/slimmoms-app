
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const app = require('./app');

require('dotenv').config();

const { DB_HOST, PORT = 5000 } = process.env;

const MONGO_URI = DB_HOST || 'mongodb://127.0.0.1:27017/SlimMoms';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Veritabanı bağlantı hatası: " + error.message);
    console.log("Lütfen .env dosyasına DB_HOST ekleyin veya yerel MongoDB'nizin çalıştığından emin olun.");
    process.exit(1);
  });
