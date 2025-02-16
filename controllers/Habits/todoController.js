const Todo = require('../../model/Todo');

const getAllTodo = async (req, res) => {
    const todos = await Todo.find();
    if (!todos) return res.status(204).json({ 'message': 'No todos currently,' });
    res.json(todos);
}

const handleNewTodo = async (req, res) => {
    if (!req.body?.taskName) {
        return res.status(401).json({ "message": "Task is required." })
    }

    const allowedTypes = ["Healthy", "Neutral", "Bad"];
    if (!allowedTypes.includes(req.body.type)) {
        return res.status(400).json({ "message": "Invalid type provided." });
    }

    try {
        const result = await Todo.create({
            taskName: req.body.taskName,
            type: req.body.type
        })

        res.status(201).json(result);
    } catch (err) {
        console.error(err)
    }
}

const deleteTodo = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'Todo ID required' });
    const todo = await Todo.findOne({ _id: req.body.id }).exec();
    if (!todo) {
        return res.status(204).json({ 'message': `Todo ID ${req.body.id} not found` });
    }
    const result = await todo.deleteOne({ _id: req.body.id });
    res.json(result);
}

const updateStatus = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID is required.' });
    }   

    const todo = await Todo.findOne({ _id: req.body.id }).exec();
    if (!todo) {
        return res.status(204).json({ "message": `No Todo matches ID ${req.body.id}.` });
    }
    if (req.body?.status) todo.status = req.body.status;
    const result = await todo.save(); 
    res.json(result);
}

module.exports = {
    handleNewTodo,
    getAllTodo,
    deleteTodo,
    updateStatus
};