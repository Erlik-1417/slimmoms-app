
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Session } = require('../models/session');

const { JWT_SECRET = 'secret-key' } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }


    const activeSession = await Session.findOne({ userId: id });
    if (!activeSession) {
      return res.status(401).json({ message: 'Not authorized - session expired' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid signature' || error.message === 'jwt expired') {
      error.status = 401;
    }
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth;
