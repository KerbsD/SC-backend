const express = require('express');
const router = express.Router();
const shoeController = require('../../controllers/sc-controllers/shoeController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), shoeController.handleAddShoe)
    .get(verifyRoles(ROLES_LIST.User), shoeController.getAllShoe)

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.User), shoeController.handleCurrentShoe)

module.exports = router;