
const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('handle').trim().notEmpty().withMessage('Handle is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { username, email, handle, password } = req.body;
      const db = req.app.locals.db;

      // Check if email or username already exists
      const emailExists = await User.findByEmail(db, email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const usernameExists = await User.findByUsername(db, username);
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const handleExists = await User.findByHandle(db, handle);
      if (handleExists) {
        return res.status(400).json({ message: 'Handle already taken' });
      }

      // Create verification token
      const verificationToken = uuidv4();

      // Create new user
      const user = new User({
        username,
        email,
        handle,
        verificationToken,
      });
      
      user.setPassword(password);
      await user.save(db);

      // Send verification email
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await sendVerificationEmail(email, username, verificationLink);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user and token
      res.status(201).json({
        user: user.getPublicProfile(),
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const db = req.app.locals.db;

      // Find user by email
      const user = await User.findByEmail(db, email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user and token
      res.json({
        user: user.getPublicProfile(),
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const db = req.app.locals.db;

    // Find user with verification token
    const [rows] = await db.query('SELECT * FROM users WHERE verificationToken = ?', [token]);
    if (!rows.length) {
      return res.json({ 
        success: false, 
        message: 'Invalid verification token' 
      });
    }

    // Update user verification status
    const user = new User(rows[0]);
    user.verified = true;
    user.verificationToken = null;
    await user.update(db);

    res.json({ 
      success: true, 
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
