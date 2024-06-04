const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const instagramClientId = '1467940277144991'; // Your Instagram App ID
const instagramClientSecret = '9386dc3dc6105e3d5ba1d47ae4b06914'; // Your Instagram Client Secret
const redirectUri = 'https://localhost:5173'; // Your Redirect URI

app.post('/instagram-token', async (req, res) => {
  const { code } = req.body;
//   console.log(code)
  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: instagramClientId,
      client_secret: instagramClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    });
    res.json(response.data);
    console.log(response.data)
  } catch (error) {
    console.error('Error exchanging Instagram code:', error);
    res.status(500).json({ error: 'Failed to exchange Instagram code' });
  }
});

const db = require('./config/database');
const User=db.User
// Create a new user
app.post('/add_users', async (req, res) => {
  const { cin } = req.body;

  try {
    // Check if a user with the same firstName, lastName, and phone exists
    const existingUser = await User.findOne({ cin});

    if (existingUser) {
      return res.status(200).json({ error: 'User with the same first name, last name, and phone number already exists.' });
    }

    // If no user is found, create a new user
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get all users
app.get('/get_users', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const Keyword=db.Keyword

// Get keywords
app.get('/getKeyword', async (req, res) => {
  try {
    const keywords = await Keyword.findOne();
    res.status(200).json(keywords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add keywords
app.post('/addKeyword', async (req, res) => {
  try {
    console.log("add")
    const { keywords } = req.body.keywords;
    const newKeywords = await Keyword.create({ keywords });
    res.status(201).json(newKeywords);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update keywords
app.put('/updateKeyword/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { keywords } = req.body;
    const keyword = await Keyword.findByPk(id);
    if (!keyword) {
      return res.status(404).json({ error: 'Keywords not found' });
    }
    keyword.keywords = keywords.keywords; // Update the keywords property directly
    await keyword.save();
    res.status(200).json(keyword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PageId=db.pageId
// Get page ID
app.get('/getPageId', async (req, res) => {
  try {
    console.log("get")
    const pageId = await PageId.findOne();
    res.status(200).json(pageId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add page ID
app.post('/addPageId', async (req, res) => {
  console.log("add")
  try {
    const { pageId } = req.body.pageId;
    const newPageId = await PageId.create({ pageId });
    res.status(201).json(newPageId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update page ID
app.put('/updatePageId/:id', async (req, res) => {
  console.log("put")
  try {
    const { id } = req.params;
    const { pageId } = req.body;
    const existingPageId = await PageId.findByPk(id);
    if (!existingPageId) {
      return res.status(404).json({ error: 'Page ID not found' });
    }
    existingPageId.pageId = pageId.pageId; // Update the pageId property directly
    await existingPageId.save();
    res.status(200).json(existingPageId);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// 'http://localhost:3000/api/add_users'
// 'http://localhost:3000/api/get_users'