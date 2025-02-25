const express = require('express');
const router = express.Router();
const notesController = require('../../controllers/Habits/notesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .post(verifyRoles(ROLES_LIST.User), notesController.handleNoteCreate)
    .delete(verifyRoles(ROLES_LIST.User), notesController.handleNoteDelete)
  
router.route('/:curUserId')
    .get(notesController.handleRenderNotes);

router.route('/:curNoteId')
    .get(notesController.handleCurNote);

router.route('/:noteId')
    .put(notesController.handleNoteUpdate);

module.exports = router;