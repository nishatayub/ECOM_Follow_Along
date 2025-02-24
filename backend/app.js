const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./db/database');
const dotenv = require('dotenv').config();
const User = require('./models/user');
const { upload } = require('upload');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: 'Error creating product',
      error: error.message,
    });
  }
});
app.post('/Login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.post('/Signup', async(req,res) => {
    const {username, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User alrady exists" })
        }
         
        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();

    }catch(err){
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});

app.post('/uploads',(req,res)=>{
    console.log(req.file);
})