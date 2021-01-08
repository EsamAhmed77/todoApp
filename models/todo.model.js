const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} });

const Todo = mongoose.model("User", todoSchema);

module.exports = Todo;