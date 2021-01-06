const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//
require("dotenv").config();

//
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

//
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_PROJECT_NAME}.co6kp.mongodb.net/<${process.env.DB_NAME}>?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
  },
  { useFindAndModify: false }
);

//Schema
const itemSchema = {
  name: String,
};

const listSchema = {
  name: String,
  tasks: [itemSchema],
};

//Model
const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

// app get request
app.get("/", (req, res) => {
  Item.find({}, (err, result) => {
    if (!err) {
      res.render("lists", { listTitle: "Today", listItems: result });
    }
  });
});

app.get("/:urlListName", (req, res) => {
  const urlListName = req.params.urlListName;

  List.findOne({ name: urlListName }, (err, foundList) => {
    if (!err) {
      if (foundList) {
        res.render("lists", {
          listTitle: foundList.name,
          listItems: foundList.tasks,
        });
      } else {
        const listName = new List({
          name: urlListName,
          tasks: [],
        });

        listName.save();
        res.redirect("/" + urlListName);
      }
    }
  });
});

//app post request
app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const list = req.body.listAddBtn;

  const item = new Item({
    name: itemName,
  });

  if (list === "Today") {
    if (itemName.length !== 0) {
      item.save();
      res.redirect("/");
    } else {
      console.log("you need to enter a name");
      res.redirect("/");
    }
  } else {
    if (itemName.length === 0) {
      console.log("you need to enter a name");
    } else {
      List.findOne({ name: list }, (err, result) => {
        if (!err) {
          result.tasks.push(item);
          result.save();
          res.redirect("/" + list);
        }
      });
    }
  }
});

app.post("/delete", (req, res) => {
  const checkedItemName = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemName, (err) => {
      if (!err) res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { tasks: { _id: checkedItemName } } },
      (err, result) => {
        if (!err) {
          console.log(err);
        }
      }
    );
    res.redirect("/" + listName);
  }
});

//
app.listen(8088, () => {
  console.log("App is on port 8088");
});
