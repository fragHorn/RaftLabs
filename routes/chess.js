const chessController = require('../controllers/chess');
const express =require('express');

const router = express.Router();

router.get('/', chessController.chess);

module.exports = router;