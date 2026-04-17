const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Middlewares are necessary for routes using the method post

mongoose.connect("mongodb://localhost/drugs");

// We create a model, assign it a nane and an object with values
const Drugs = mongoose.model("Drugs", {
  name: String,
  quantity: Number,
});

// CRUD - CREATE - UPDATE - READ - DELETE

// THIS IS CREATE - BY CONVENTION WE USE THE METHOD POST FOR IT, WE ALSO USE THE BODY ;)
app.post("/drugs", async (req, res) => {
  try {
    // we create a new variable and assign it the element's values inside our model that we will query
    const newDrugs = new Drugs({
      name: req.body.name,
      quantity: req.body.quantity,
    });

    // we await the promise of this variable and use the save method to save the queries made by the user
    // We need to use the method save() to create new elements and assign them values
    await newDrugs.save();
    res.status(200).json(newDrugs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// THIS IS READ - BY CONVENTION WE USE THE METHOD GET FOR IT
app.get("/drugs", async (req, res) => {
  try {
    // we use the method find to find an element and its value
    // you can specify the value of an element inside find and it will only return the matching element
    // the find method always returns its values inside an array that contains an object [{}]
    const allDrugs = await Drugs.find({
      quantity: req.query.quantity,
    });

    res.status(200).json(allDrugs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// THIS IS UPDATE - FOR THAT WE USE THE METHOD PUT
// This one requires to find a specific element, assign a change to it and save the change made to it with the method save()
app.put("/drugs/add/:id", async (req, res) => {
  try {
    const updateDrugs = await Drugs.findOne({
      _id: req.params.id,
    });

    updateDrugs.quantity = updateDrugs.quantity + Number(req.body.quantity);
    await updateDrugs.save();
    res.status(200).json(updateDrugs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// THIS TIME TO DECREMENT THE VALUE
app.put("/drugs/remove/:id", async (req, res) => {
  try {
    const updateDrugs = await Drugs.findOne({
      _id: req.params.id,
    });
    updateDrugs.quantity = updateDrugs.quantity - Number(req.body.quantity);
    await updateDrugs.save();
    res.status(200).json(updateDrugs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.all(/.*/, (req, res) => {
  res.status(404).json("Route not found");
});

app.listen(3000, () => {
  console.log("Server has started");
});
