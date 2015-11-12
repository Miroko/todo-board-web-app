
import Api from '../api'

const Task = {
  id: null,
  text: "",
  isDone: false,

  init: function(id, text, isDone){
    this.id = id;
    this.text = text;
    this.isDone = isDone;
    return this;
  }
}

const TaskList = {
  id: null,
  title: "",
  tasks: [],

  init: function(id, title, tasks){
    this.id = id;
    this.title = title;
    this.tasks = tasks;
    return this;
  },
  addTask(task){
    this.tasks.push(task);
  },
  getTask(taskId){
    return this.tasks.find(task =>{
      return task.id === taskId;
    });
  },
  deleteTask(taskId){
    return this.tasks.some((task, index, array) =>{
      if(task.id === taskId){
        array.splice(index, 1);
        return true;
      }
      else return false;
    });
  }
}

const Board = {
  id: null,
  title: "",
  taskLists: [],

  init: function(id, title, taskLists){
    this.id = id;
    this.title = title;
    this.taskLists = taskLists;
    return this;
  },
  addTaskList(taskList){
    this.taskLists.push(taskList);
  },
  getTaskList(listId){
    return this.taskLists.find(taskList =>{
      return taskList.id === listId;
    });
  },
  deleteTaskList(listId){
    return this.taskLists.some((taskList, index, array) =>{
      if(taskList.id === listId){
        array.splice(index, 1);
        return true;
      }
      else return false;
    });
  },
  sortByTasksAmount: function(){
    this.taskLists.sort((listA, listB) =>{
      return listB.tasks.length - listA.tasks.length;
    });
  },
  sortByUndoneTasks: function(){
    this.taskLists.sort((listA, listB) =>{
      const unDoneTaskAmount = function(list){
        let undoneAmount = 0;
        list.tasks.forEach(task =>{
          if(!task.isDone) undoneAmount++;
        });
        return undoneAmount;
      }
      const unDoneTasksDifference = unDoneTaskAmount(listB) - unDoneTaskAmount(listA);
      if(unDoneTasksDifference === 0){
        return listB.tasks.length - listA.tasks.length;
      }
      else{
        return unDoneTasksDifference;
      }
    });
  }
}

const TodoAppData = {
  userId: null,
  userBoardIds: [],
  loadedBoards: [],
  currentBoardIndex: null,

  isEmpty: function(){
    return this.loadedBoards.length === 0;
  },

  //RESET
  reset: function(){
    this.userBoardIds = [];
    this.loadedBoards = [];
    this.currentBoardIndex = 0;
  },

  //LOAD
  loadUser: function(userId){
    return new Promise((resolve, reject) => {
      return Api.getUser(userId)
      .then(userJSON => {
          this.userId = userJSON.id;
          this.userBoardIds = userJSON.boardIds;
          resolve(true);
      });
    });
  },
  loadBoards: function(){
    let requests = [];
    this.userBoardIds.forEach(boardId =>{
      requests.push(new Promise((resolve, reject) => {
        return Api.getBoard(this.userId, boardId).then(boardJSON => {
          return resolve(boardJSON);
        });
      }));
    });
    return Promise.all(requests).then(boardJSONs => {
      boardJSONs.forEach(boardJSON =>{
        this.addBoard(boardJSON.id, boardJSON.title, boardJSON.taskLists);
      });
      return true;
    });
  },

  //SELECT
  selectNextBoard: function(){
    this.currentBoardIndex++;
    if(this.currentBoardIndex > this.userBoardIds.length - 1){
      this.currentBoardIndex = 0;
    }
  },
  selectPreviousBoard: function(){
    this.currentBoardIndex--;
    if(this.currentBoardIndex < 0){
      this.currentBoardIndex = this.userBoardIds.length - 1;
    }
  },
  selectBoard: function(boardId){
    for(let index = 0; index <= this.userBoardIds.length - 1; index++){
      if(this.userBoardIds[index] === boardId){
          this.currentBoardIndex = index;
          return index;
      }
    }
    return -1;
  },

  //GET
  getBoardsForCarousel: function(){
    return this.loadedBoards;
  },
  getCurrentBoard: function(){
    return this.loadedBoards[this.currentBoardIndex];
  },

  getBoard: function(boardId){
    return this.loadedBoards.find(board =>{
      return board.id === boardId;
    });
  },
  getTaskList: function(boardId, listId){
    return this.getBoard(boardId).getTaskList(listId);
  },
  getTask: function(boardId, listId, taskId){
    return this.getTaskList(boardId, listId).getTask(taskId);
  },

  //ADD
  addBoard: function(boardId, title, taskListsJSON){
    const taskLists = [];
    taskListsJSON.forEach(taskListJSON =>{
      const tasks = [];
      taskListJSON.tasks.forEach(taskJSON =>{
        tasks.push(Object.create(Task).init(taskJSON.id, taskJSON.text, taskJSON.isDone));
      });
      taskLists.push(Object.create(TaskList).init(taskListJSON.id, taskListJSON.title, tasks));
    });
    this.loadedBoards.push(Object.create(Board).init(boardId, title, taskLists));
  },
  addTaskList: function(boardId, listId, title, tasksJSON){
    const tasks = [];
    tasksJSON.forEach(taskJSON =>{
      tasks.push(Object.create(Task).init(taskJSON.id, taskJSON.text, taskJSON.isDone));
    });
    this.getBoard(boardId).addTaskList(Object.create(TaskList).init(listId, title, tasks));
  },
  addTask: function(boardId, listId, taskId, text, isDone){
    this.getBoard(boardId).getTaskList(listId).addTask(Object.create(Task).init(taskId, text, isDone));
  },

  //DELETE
  deleteBoard: function(boardId){
    return this.loadedBoards.some((board, index, array) =>{
      if(board.id === boardId){
        array.splice(index, 1);
        return true;
      }
      else return false;
    });
  },
  deleteTaskList: function(boardId, listId){
    return this.getBoard(boardId).deleteTaskList(listId);
  },
  deleteBoard: function(boardId, listId, taskId){
    return this.getBoard(boardId).getTaskList(listId).deleteTask(taskId);
  },
}

export default TodoAppData;
