const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/sc-controllers/cartController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), cartController.handleCartItems)
    .get(verifyRoles(ROLES_LIST.User), cartController.getAllCartItems)
    .delete(verifyRoles(ROLES_LIST.User), cartController.handleDeleteCartItem)

module.exports = router;