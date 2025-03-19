const express = require('express');
const router = express.Router();
const shoeController = require('../../controllers/sc-controllers/shoeController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), shoeController.handleCartItems)
    .get(verifyRoles(ROLES_LIST.User), shoeController.getAllShoe)

module.exports = router;