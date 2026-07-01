const router = require('express').Router();
const {
  listPositions,
  createPosition,
} = require('../controllers/teacherPosition.controller');

router.get('/', listPositions);
router.post('/', createPosition);

module.exports = router;
