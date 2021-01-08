const Todo = require(__dirname + "/../models/todo.model.js");

exports.getTodos = async (req, res) => {
    try {
        const todo = await Todo.find({});
        res.status(200).send({status: 200, todo, success: true});
    } catch (e) {
        res.status(500).send({status: 500, ...e})
    }
}

exports.createTodo = async (req, res) => {
    const newItem = req.body.item;

    const item = new Todo({
        item: newItem,
    });

    item.save(((err, doc) => {
        if (err) {
            res.status(500).send({status: 500, message: err, success: false});
        }
        res.status(200).send({status: 200, item, success: true});
    }))

}

exports.deleteTodo = async (req, res) => {
    const item = req.params.id;

    Todo.findByIdAndRemove(item, {new: true, useFindAndModify: false}, (err) => {
        if (err) return res.status(500).send();
        res.status(200).send({status: 200, message: "Deleted successfully", success: true});
    });
}