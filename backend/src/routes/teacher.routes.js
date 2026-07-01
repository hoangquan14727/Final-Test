const router = require('express').Router();
const { listTeachers, createTeacher } = require('../controllers/teacher.controller');

router.get('/', listTeachers);
router.post('/', createTeacher);

module.exports = router;
