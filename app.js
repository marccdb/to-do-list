const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(3000, () => console.log("listening on port 3000"));

//MONGO DB
mongoose.connect(
	"mongodb+srv://Marcio:yA1HB2eVZaVCzIho@cluster0-oot0x.gcp.mongodb.net/test?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const toDoSchema = new mongoose.Schema({
	name: String,
});

const toDoModel = mongoose.model("todo", toDoSchema);

const defaultTodo1 = new toDoModel({
	name: "Wake up",
});

const defaultTodo2 = new toDoModel({
	name: "Brush your teeth",
});

const defaultTodo3 = new toDoModel({
	name: "Eat breakfast",
});

const defaultTodDosArr = [defaultTodo1, defaultTodo2, defaultTodo3];

//Set up routes
app.get("/", (req, res) => {
	let today = new Date();

	let options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};

	let day = today.toLocaleDateString("en-US", options);

	toDoModel.find({}, (error, foundItems) => {
		if (foundItems === 0) {
			const defaultTodDosDB = toDoModel.insertMany({ defaultTodDosArr }, (err) => {
				if (err) console.log(err);
			});
			res.redirect("/");
		} else {
			res.render("list", { dayToday: day, foundItems });
		}
	});
});

app.post("/", (req, res) => {
	let newItem = req.body.newItem;
	let newToDo = new toDoModel({
		name: newItem,
	});
	newToDo.save((err) => console.log(err));
	res.redirect("/");
});
