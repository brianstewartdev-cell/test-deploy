const express = require('express');
const router = express.Router();
const autogenController = require('../controllers/autogen.controller');      
// Add other controllers as needed  
// Define routes
router.post('/answer', autogenController.answer);       

module.exports = router;