const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, email, mobileNumber } = req.body;

    if (!username || !password || !fullName || !email || !mobileNumber) {
      return res.status(400).send('All fields are required');
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).send('Invalid email format');
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).send('Invalid mobile number format');
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('User already exists');
    }

    let isAdmin = false;
    if (email.endsWith('@numetry.in')) {
      isAdmin = true;
    }

    user = new User({ username, password, fullName, email, mobileNumber, isAdmin });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    user.loginTimes.push(new Date());
    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // Check email domain to determine redirect
    if (user.email.endsWith('@numetry.in')) {
      return res.send({ token, redirect: '/admin/chartspage' });
    } else {
      return res.send({ token, redirect: '/' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});

router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).send('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(400).send('Token is missing');
    }

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(400).send('Invalid user');
      }

      user.logoutTimes.push(new Date());
      await user.save();

      res.send('Logged out successfully');
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          status: 'error',
          message: 'Token has expired',
          redirect: '/login'
        });
      } else {
        console.error('JWT verification failed:', error);
        res.status(401).json({
          status: 'error',
          message: 'Invalid token',
          redirect: '/login'
        });
      }
    }
  } catch (error) {
    console.error('Error in logout route:', error);
    res.status(500).send('Server error');
  }
});

router.get('/login-logout-times', async (req, res) => {
  try {
    const users = await User.find({}, 'username fullName email mobileNumber isAdmin loginTimes logoutTimes').exec();
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username fullName email mobileNumber isAdmin loginTimes logoutTimes').exec();
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Received user ID for update:', userId);
    console.log('Update data:', req.body);

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).send('User not found');
    }
    console.log('User updated:', user);
    res.send(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send(error);
  }
});

router.get('/username/:username', async (req, res) => {
  try {
    console.log('Fetching user for username:', req.params.username); // Log the username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      console.log('User not found for username:', req.params.username); // Log if user not found
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/userId', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error('Error fetching user ID:', error);
    res.status(500).json({ error: 'Failed to fetch user ID' });
  }
});


module.exports = router;
