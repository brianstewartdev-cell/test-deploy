const express = require('express');
const router = express.Router();
const autoRoute = require('./autogen.route'); // Import other routes as needed

router.use('/autogen', autoRoute); // Use other routes as needed

module.exports = router;