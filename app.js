require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/Books');
const cartRoutes = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const PurchaseRouter = require('./routes/Purchase'); 
const ContactRouter = require('./routes/Contact'); 
const ChartsRouter = require('./routes/Charts'); 
const authMiddleware = require('./middleware/auth');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/purchase', PurchaseRouter); 
app.use('/api/contact', ContactRouter); 
app.use('/api/charts', ChartsRouter); 

app.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
