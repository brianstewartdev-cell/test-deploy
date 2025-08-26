require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/api', require('./routers')); // Use the routers


// Serve frontend build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listen on Railway's PORT
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));