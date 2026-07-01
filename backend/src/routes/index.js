const router = require('express').Router();

router.use('/teachers', require('./teacher.routes'));
router.use('/teacher-positions', require('./teacherPosition.routes'));

module.exports = router;
