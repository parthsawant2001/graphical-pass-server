const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
const PORT = 3000;
app.use(
  cors({
    credentials: true,
    origin: [
      'https://graphical-pass-client-git-main-parthsawant2001.vercel.app',
      'https://graphical-pass-client.vercel.app',
      'https://graphical-pass-client-3sed7p1r0-parthsawant2001.vercel.app/',
      'https://graphical-pass-client-parthsawant2001.vercel.app/',
    ],
  })
);
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.set('strictQuery', false);
mongoose.connect(
  'mongodb+srv://parthpsawant20:Coderrrr<>@cluster0.sjvdum8.mongodb.net/?retryWrites=true&w=majority'
);

const salt = bcrypt.genSaltSync(10);
const secret = 'fieuwhfuihwruifhuirhfuirhu';
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const userDoc = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
      // password: bcrypt.hashSync(password, salt),
    });
    res.send(userDoc);
  } catch (e) {
    res.status(404).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong creds');
  }
});

app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
