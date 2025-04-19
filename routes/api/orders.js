const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/sc-controllers/orderController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), orderController.handleNewOrder)

module.exports = router;