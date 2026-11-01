const express = require('express');
const { listStudents, createStudent, updateStudent, deleteStudent, bulkCreateStudents } = require('../controllers/studentController');
const router = express.Router();
router.get('/', listStudents);
router.post('/bulk', bulkCreateStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
module.exports = router;
