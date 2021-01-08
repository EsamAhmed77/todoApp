require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));

//
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_PROJECT_NAME}/${process.env.DB_NAME}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("Connected successfully"))
    .catch((r) => console.log("Error from mongo >>", r))

//Schema
const itemSchema = {
    name: String,
};

//Model
const Item = mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
    res.status(200).send({app: "dashboard-app", version: "0.1.0"});
})

// app get request
app.get("/todo", async (req, res) => {
    try {
        const todo = await Item.find({});
        res.status(200).send({status: 200, todo, success: true});
    } catch (e) {
        res.status(500).send({status: 500, ...e})
    }
});

app.post("/todo", (req, res) => {
    const newItem = req.body.item;

    const item = new Item({
        name: newItem,
    });

    item.save(((err, doc) => {
        if (err) {
            res.status(500).send({status: 500, message: err, success: false});
        }
        res.status(200).send({status: 200, item, success: true});
    }))

});

app.delete("/todo/:id", (req, res) => {
    const item = req.params.id;

    Item.findByIdAndRemove(item, {new: true, useFindAndModify: false}, (err) => {
        if (err) return res.status(500).send();
        res.status(200).send({ status: 200, message: "Deleted successfully", success: true });
    });
});

app.use((req, res, next) => {
    res.status(404).send({status: 404, message: "required path not found", success: false});
})

//
app.listen(process.env.PORT, () => {
    console.log("App is on port 8088");
});
