import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import webpack from "webpack";
import config from "../webpack.config.dev";

const port = 8888;

const app = express();
const compiler = webpack(config);

app.use(bodyParser.json());
app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

const TaskSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  text: String,
  isDone: Boolean
});
const TaskListSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  title: String,
  tasks: [ TaskSchema ]
});
const BoardSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  title: String,
  taskLists: [ TaskListSchema ]
});
const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  name: String,
  password: String,
  boards: [ BoardSchema ]
});

const UserModel = mongoose.model("User", UserSchema);

mongoose.connect("mongodb://localhost:27017/todoapp");

//POST
app.post("/api/user", (req, res) =>{
  const user = new UserModel({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    password: req.body.password,
    boards: []
  });
  user.save((err, user) =>{
    if(err) res.status(500).send();
    else res.status(201).json(user);
  });
});
app.post("/api/user/:userId/board", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const newBoard = {
      _id: mongoose.Types.ObjectId(),
      title: "",
      taskLists: []
    };
    user.boards.push(newBoard);
    user.save(function(err){
      if(err) res.status(500).send();
      res.status(201).json(newBoard);
    });
  });
});
app.post("/api/user/:userId/board/:boardId/taskList", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const newTask = {
      _id: mongoose.Types.ObjectId(),
      text: "",
      isDone: false
    };
    const newTaskList = {
      _id: mongoose.Types.ObjectId(),
      title: "",
      tasks: [ newTask ]
    };
    board.taskLists.push(newTaskList);
    user.save(err =>{
      if(err) res.status(500).send();
      res.status(201).json(newTaskList);
    });
  });
});
app.post("/api/user/:userId/board/:boardId/taskList/:taskListId/task", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const taskList = board.taskLists.id(req.params.taskListId);
    if(taskList === null) res.status(400).send();

    const newTask = {
      _id: mongoose.Types.ObjectId(),
      text: "",
      isDone: false
    };
    taskList.tasks.push(newTask);
    user.save(err =>{
      if(err) res.status(500).send();
      res.status(201).json(newTask);
    });
  });
});

//GET
app.get("/api/user/:userId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();
    res.status(200).json(user);
  });
});
app.get("/api/user/:userId/board/:boardId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    res.status(200).json(board);
  });
});

//PATCH
app.patch("/api/user/:userId/board/:boardId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    let patched = false;
    if(typeof req.body.title === "string"){
       board.title = req.body.title;
       patched = true;
    }
    if(!patched) res.status(400).send();

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});
app.patch("/api/user/:userId/board/:boardId/taskList/:taskListId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const taskList = board.taskLists.id(req.params.taskListId);
    if(taskList === null) res.status(400).send();

    let patched = false;
    if(typeof req.body.title === "string"){
       taskList.title = req.body.title;
       patched = true;
    }
    if(!patched) res.status(400).send();

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});
app.patch("/api/user/:userId/board/:boardId/taskList/:taskListId/task/:taskId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const taskList = board.taskLists.id(req.params.taskListId);
    if(taskList === null) res.status(400).send();

    const task = taskList.tasks.id(req.params.taskId);
    if(task === null) res.status(400).send();

    let patched = false;
    if(typeof req.body.text === "string"){
       task.text = req.body.text;
       patched = true;
    }
    if(typeof req.body.isDone === "boolean"){
       task.isDone = req.body.isDone;
       patched = true;
    }
    if(!patched) res.status(400).send();

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});

//DELETE
app.delete("/api/user/:userId/board/:boardId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    board.remove(err =>{
      if(err) res.status(400).send();
    });

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});
app.delete("/api/user/:userId/board/:boardId/taskList/:taskListId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const taskList = board.taskLists.id(req.params.taskListId);
    if(taskList === null) res.status(400).send();

    taskList.remove(err =>{
      if(err) res.status(400).send();
    });

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});
app.delete("/api/user/:userId/board/:boardId/taskList/:taskListId/task/:taskId", (req, res) =>{
  UserModel.findById(req.params.userId, (err, user) =>{
    if(err) res.status(400).send();

    const board = user.boards.id(req.params.boardId);
    if(board === null) res.status(400).send();

    const taskList = board.taskLists.id(req.params.taskListId);
    if(taskList === null) res.status(400).send();

    const task = taskList.tasks.id(req.params.taskId);
    if(task === null) res.status(400).send();

    task.remove(err =>{
      if(err) res.status(400).send();
    });

    user.save(err =>{
      if(err) res.status(500).send();
      res.status(204).send();
    });
  });
});

app.get("*", (req, res) =>{
  res.sendFile(path.join(__dirname, "/../web/index.dev.html"));
});

app.listen(port, "localhost", err =>{
  if(err) console.log(err);
  else console.log("Listening at http://localhost:" + port);
});
