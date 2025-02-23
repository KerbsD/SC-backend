const Note = require('../../model/Notes');

const handleRenderNotes = async (req, res) => {
    const curUserId = req.params.curUserId;
    const notes = await Note.find({  curUserId });
    if (!notes) return res.status(204).json({ 'message': 'You have no Notes :>' });
    res.json(notes);
}

const handleCurNote = async (req, res) => {
    const id = req.params.curNoteId;
    const note = await Note.findOne({ id });
    if (!note) return res.status(204).json({ 'message': 'Note not available :>' });
    res.json(note);
}

const handleNoteCreate = async (req, res) => {
    if (!req.body?.title) {
        return res.status(401).json({ "message": "Note title is required." })
    }

    if (!req.body?.content) {
        return res.status(401).json({ "message": "Note content is required." })
    }

    try {
        const result = await Note.create({
            curUserId: req.body.curUserId,
            title: req.body.title,
            content: req.body.content,
            noteBg: req.body.noteBg
        })
        res.status(201).json(result);
    } catch (err) {
        console.error(err)
    }
}

const handleNoteDelete = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'Note ID required' });
    const note = await Note.findOne({ _id: req.body.id }).exec();
    if (!note) {
        return res.status(204).json({ 'message': `Note ID ${req.body.id} not found` });
    }
    const result = await note.deleteOne({ _id: req.body.id });
    res.json({
        message: "Note successfully Deleted.",
        result: result
    });
}

const handleNoteUpdate = async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ "message": "Title and content are required" });
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ "message": `Note ID ${noteId} not found` });
        }

        res.json({
            message: `Note successfully updated`,
            updatedNote: updatedNote
        });

    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = {
    handleNoteCreate,
    handleNoteDelete,
    handleRenderNotes,
    handleNoteUpdate,
    handleCurNote
}