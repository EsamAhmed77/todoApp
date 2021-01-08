require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const todos = require(__dirname + "/routes/todo.routes");

//
app.use(bodyParser.urlencoded({extended: true}));

//
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_PROJECT_NAME}/${process.env.DB_NAME}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("Connected successfully"))
    .catch((r) => console.log("Error from mongo >>", r))

// main route
app.get("/", (req, res) => {
    res.status(200).send({app: "dashboard-app", version: "0.1.0"});
})

/** Routes **/
todos(app);

// handle unknown paths
app.use((req, res, next) => {
    res.status(404).send({status: 404, message: "required path not found", success: false});
})

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
    console.log("App is on port 8088");
});
