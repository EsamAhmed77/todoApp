const controllers = require(__dirname + "/../controllers/todo.controller.js");

module.exports = function (app) {
    app.get("/todo", controllers.getTodos);

    app.post("/todo", controllers.createTodo);

    app.delete("/todo/:id", controllers.deleteTodo);
}