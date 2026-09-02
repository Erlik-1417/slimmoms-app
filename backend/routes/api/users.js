
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
const { Session } = require('../../models/session');
const auth = require('../../middlewares/auth');

const { JWT_SECRET = 'secret-key', REFRESH_SECRET_KEY = 'refresh-secret-key' } = process.env;

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, userData } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'Bu profil zaten kayıtlı' });
    }

    const newUser = new User({ 
      name, 
      email: normalizedEmail,
      userData: userData || {
        weight: 0,
        height: 0,
        age: 0,
        bloodType: 1,
        desiredWeight: 0,
        dailyRate: 0,
        notAllowedProducts: []
      }
     });
    newUser.setPassword(password);
    await newUser.save();
    console.log(`✅ Yeni kullanıcı başarıyla kaydedildi: ${normalizedEmail}`);

    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        userData: newUser.userData,
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🔍 Giriş isteği alındı: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '30d' });

    const newSession = await Session.create({ userId: user._id, refreshToken });
    console.log(`🔓 Kullanıcı girişi başarılı: ${normalizedEmail}`);

    res.json({
      accessToken,
      refreshToken,
      sessionId: newSession._id,
      user: {
        name: user.name,
        email: user.email,
        userData: user.userData,
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.body;
    if (!refreshToken || !sessionId) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    try {
      const { id } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
      const session = await Session.findById(sessionId);
      
      if (!session || session.refreshToken !== refreshToken || String(session.userId) !== id) {
        return res.status(401).json({ message: 'Invalid session' });
      }

      const newAccessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
      const newRefreshToken = jwt.sign({ id }, REFRESH_SECRET_KEY, { expiresIn: '30d' });

      session.refreshToken = newRefreshToken;
      await session.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionId: session._id
      });
    
    } catch (_e) {
      return res.status(401).json({ message: 'Refresh token expired or invalid' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    const { sessionId } = req.body; 
    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    } else {
      
      await Session.deleteMany({ userId: req.user._id });
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/current', auth, async (req, res, next) => {
  try {
    const { email, name, userData } = req.user;
    res.json({ email, name, userData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
