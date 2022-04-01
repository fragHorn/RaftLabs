const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file');

router.get('/', fileController.display);
router.post('/', fileController.find);
router.post('/by-email', fileController.findByEmail);
router.get('/sorted', fileController.sorted);
router.post('/add/book', fileController.add);
router.post('/add/mag', fileController.addMag);

module.exports = router;