const express = require('express');
const router = express.Router();
const {getSongs , setSongs } = require('../controllers/songController');


router.get('/:id' , getSongs);
router.post('/' , setSongs);

module.exports = router;