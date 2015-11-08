var port = 8888;

var path = require('path');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser')
var webpack = require('webpack');
var config = require('../webpack.config.dev');

var app = express();
var compiler = webpack(config);

app.use(bodyParser.json());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

//ID
var currentId = 0;
function generateId(){
  currentId = currentId + 1;
  return currentId;
}

//DATABASE
const database = new Map();

//INIT DEMO DATA
const user1 = addUser("demouser", "demopassword");

const boardId1 = addBoard(user1, "Demo board 1");
const listId1 = addTaskList(user1, boardId1, "Demo list");
const listId2 = addTaskList(user1, boardId1, "");
const taskId1 = addTask(user1, boardId1, listId1, "Demo task", false);
const taskId2 = addTask(user1, boardId1, listId1, "", false);
const taskId3 = addTask(user1, boardId1, listId2, "", false);

const boardId2 = addBoard(user1, "Demo board 2");
const listId3 = addTaskList(user1, boardId2, "Demo list");
const listId4 = addTaskList(user1, boardId2, "");
const taskId4 = addTask(user1, boardId2, listId3, "Demo task", false);
const taskId5 = addTask(user1, boardId2, listId3, "", false);
const taskId6 = addTask(user1, boardId2, listId4, "", false);

const boardId3 = addBoard(user1, "Demo board 3");
const boardId4 = addBoard(user1, "Demo board 4");
const boardId5 = addBoard(user1, "Demo board 5");

//GET
function getUser(userId){
  return database.get(userId);
}
function getBoard(userId, boardId){
  return getUser(userId).boards.get(boardId);
}
function getTaskList(userId, boardId, listId){
  return getBoard(userId, boardId).taskLists.get(listId);
}
function getTask(userId, boardId, listId, taskId){
  return getTaskList(userId, boardId, listId).tasks.get(taskId);
}

//ADD
function addUser(name, password){
  const userId = generateId();
  database.set(userId, { name: name, password: password, boards: new Map() } );
  return userId;
}
function addBoard(userId, boardTitle){
  const boardId = generateId();
  database.get(userId).boards.set(boardId, { title: boardTitle, taskLists: new Map() });
  return boardId;
}
function addTaskList(userId ,boardId, listTitle){
  const listId = generateId();
  getBoard(userId, boardId).taskLists.set(listId, { title: listTitle, tasks: new Map() });
  return listId;
}
function addTask(userId, boardId, listId, text, isDone){
  const taskId = generateId();
  getTaskList(userId, boardId, listId).tasks.set(taskId, { text: text, isDone: isDone });
  return taskId;
}

//DELETE
function deleteBoard(userId, boardId){
  getUser(userId).boards.delete(boardI);
}

function deleteTaskList(userId, boardId, listId){
  getBoard(userId, boardId).taskLists.delete(listId);
}

function deleteTask(userId, boardId, listId, taskId){
  getTaskList(userId, boardId, listId).tasks.delete(taskId);
}

//UPDATE
function updateBoardTitle(userId, boardId, newTitle){
  getBoard(boardId).title = newTitle;
}

function updateListTitle(userId, boardId, listId, newTitle){
  getTaskList(boardId, listId).title = newTitle;
}

function updateTaskText(userId, boardId, listId, taskId, newText){
  getTask(boardId, listId, taskId).text = newText;
}

function updateTaskIsDone(userId, boardId, listId, taskId, newIsDone){
  getTask(boardId, listId, taskId).isDone = newIsDone;
}

//REST API

//POST
app.post('/api/user/:userId/board', function (req, res){
  const boardId =
  addBoard(
    Number(req.params.userId),
    req.body.title);

  res.status(201);
  res.send({ id: boardId, taskLists: [] });
});
app.post('/api/user/:userId/board/:boardId/list', function (req, res){
  const title = req.body.title

  const listId =
    addTaskList(
      Number(req.params.userId),
      Number(req.params.boardId),
      title);

  const taskId =
    addTask(
      Number(req.params.userId),
      Number(req.params.boardId),
      Number(listId),
      "",
      false);

  res.status(201);
  res.send({ id: listId, title: title, tasks: [{ id: taskId, text: "", isDone: false }] });
});
app.post('/api/user/:userId/board/:boardId/list/:listId/task', function (req, res){
  const text = req.body.text;
  const isDone = req.body.isDone

  const taskId =
    addTask(
      Number(req.params.userId),
      Number(req.params.boardId),
      Number(req.params.listId),
      text,
      isDone);

  res.status(201);
  res.send({ id: taskId, text: text, isDone: isDone });
});

//GET
app.get('/api/user/:userId', function(req, res) {
  const user = getUser(Number(req.params.userId));

  var userJSON = {};
  userJSON.id = Number(req.params.userId);
  userJSON.boardIds = Array.from(user.boards.keys());

  res.status(200);
  res.send(userJSON);
});
app.get('/api/user/:userId/board/:boardId', function (req, res) {
  const board =
    getBoard(
      Number(req.params.userId),
      Number(req.params.boardId));

  var boardJSON = {};
  boardJSON.id = Number(req.params.boardId);
  boardJSON.title = board.title;
  boardJSON.taskLists = [];
  board.taskLists.forEach((list, listKey, listsMap) => {
    const index = boardJSON.taskLists.length;
    boardJSON.taskLists[index] = { id: listKey, title: list.title, tasks: [] };
    list.tasks.forEach((task, taskKey, tasksMap) => {
      boardJSON.taskLists[index].tasks[boardJSON.taskLists[index].tasks.length] = { id: taskKey, text: task.text, isDone: task.isDone };
    });
  });

  res.status(200);
  res.send(boardJSON);
});

//PUT
app.put('/api/user/:userId/board/:boardId/title', function (req, res) {
  const board = getBoard(
    Number(req.params.userId),
    Number(req.params.boardId));
  board.title = req.body.title;

  res.sendStatus(204);
});
app.put('/api/user/:userId/board/:boardId/list/:listId/title', function (req, res) {
  const taskList = getTaskList(
    Number(req.params.userId),
    Number(req.params.boardId),
    Number(req.params.listId));
  taskList.title = req.body.title;

  res.sendStatus(204);
});
app.put('/api/user/:userId/board/:boardId/list/:listId/task/:taskId/text', function (req, res) {
  const task = getTask(
    Number(req.params.userId),
    Number(req.params.boardId),
    Number(req.params.listId),
    Number(req.params.taskId));
  task.text = req.body.text;

  res.sendStatus(204);
});
app.put('/api/user/:userId/board/:boardId/list/:listId/task/:taskId/isDone', function (req, res) {
  const task = getTask(
    Number(req.params.userId),
    Number(req.params.boardId),
    Number(req.params.listId),
    Number(req.params.taskId));
  task.isDone = req.body.isDone;

  res.sendStatus(204);
});

//DELETE
app.delete('/api/user/:userId/board/:boardId', function (req, res) {
  deleteBoard(
    Number(req.params.userId),
    Number(req.params.boardId));

  res.sendStatus(204);
});
app.delete('/api/user/:userId/board/:boardId/list/:listId', function (req, res) {
  deleteTaskList(
    Number(req.params.userId),
    Number(req.params.boardId),
    Number(req.params.listId));

  res.sendStatus(204);
});
app.delete('/api/user/:userId/board/:boardId/list/:listId/task/:taskId', function (req, res) {
  deleteTask(
    Number(req.params.userId),
    Number(req.params.boardId),
    Number(req.params.listId),
    Number(req.params.taskId));

  res.sendStatus(204);
});

app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/../web/index.dev.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port);
});
