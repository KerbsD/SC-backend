const express = require('express');
const router = express.Router();
const todoController = require('../../controllers/Habits/todoController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), todoController.getAllTodo )
    .post(verifyRoles(ROLES_LIST.Admin), todoController.handleNewTodo)
    .delete(verifyRoles(ROLES_LIST.Admin), todoController.deleteTodo)

module.exports = router;