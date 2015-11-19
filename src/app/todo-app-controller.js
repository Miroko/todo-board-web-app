
import TodoAppModel from './todo-app-model'
import Api from './api'

const TodoAppController = {
  modelChanged: null, //function
  selectedBoardIndex: null,
  updateData: {
    //null = all
    //id = element with that id
    //-1 = none
    //null, null -> render all lists and tasks
    //list, null -> render single list without tasks
    //list, task -> render single task
    listEditedId: null,
    taskEditedId: null
  },

  setModelChangeListener: function(onModelChange){
    TodoAppController.modelChanged = onModelChange;
  },
  getModel: function(){
    return TodoAppModel;
  },
  getCurrentUserId: function(){
    return TodoAppModel.userId;
  },

  //SORT
  sortSelectedBoardByUndoneTasks: function(){
    TodoAppController.getSelectedBoard().sortByUndoneTasks();
    TodoAppController.modelChanged();
  },

  //SELECT
  selectNextBoard: function(){
    TodoAppController.selectedBoardIndex++;
    if(TodoAppController.selectedBoardIndex > TodoAppModel.userBoardIds.length - 1){
      TodoAppController.selectedBoardIndex = 0;
    }
  },
  selectPreviousBoard: function(){
    TodoAppController.selectedBoardIndex--;
    if(TodoAppController.selectedBoardIndex < 0){
      TodoAppController.selectedBoardIndex = TodoAppModel.userBoardIds.length - 1;
    }
  },
  selectBoard: function(boardId){
    for(let index = 0; index <= TodoAppModel.userBoardIds.length - 1; index++){
      if(TodoAppModel.userBoardIds[index] === boardId){
          TodoAppController.selectedBoardIndex = index;
          return index;
      }
    }
    return -1;
  },

  //LOAD
  loadInitialData: function(userId){
    return TodoAppController.loadUser(userId).then(loaded => {
      return TodoAppController.loadBoards().then(loaded => {

        TodoAppController.updateData.listEditedId = null;
        TodoAppController.updateData.taskEditedId = null;

        TodoAppController.selectedBoardIndex = 0;

        TodoAppController.modelChanged();

        return true;
      });
    });
  },
  loadUser: function(userId){
    return new Promise((resolve, reject) => {
      return Api.getUser(userId)
      .then(userJSON => {
          TodoAppModel.userId = userJSON.id;
          TodoAppModel.userBoardIds = userJSON.boardIds;
          resolve(true);
      });
    });
  },
  loadBoards: function(){
    let requests = [];
    TodoAppModel.userBoardIds.forEach(boardId =>{
      requests.push(new Promise((resolve, reject) => {
        return Api.getBoard(TodoAppModel.userId, boardId).then(boardJSON => {
          return resolve(boardJSON);
        });
      }));
    });
    return Promise.all(requests).then(boardJSONs => {
      boardJSONs.forEach(boardJSON =>{
        TodoAppModel.addBoard(boardJSON.id, boardJSON.title, boardJSON.taskLists);
      });
      return true;
    });
  },

  //GET
  getUpdateData: function(){
    return TodoAppController.updateData;
  },
  getBoardsForCarousel: function(){
    return TodoAppModel.loadedBoards.slice(TodoAppController.selectedBoardIndex, TodoAppController.selectedBoardIndex + 1);
  },
  getSelectedBoard: function(){
    return TodoAppModel.loadedBoards[TodoAppController.selectedBoardIndex];
  },

  //CREATE
  createBoard: function(userId){
    return Api.createBoard(userId, "")
    .then(data =>{
      TodoAppModel.addBoard(data.id, data.title, data.taskLists);

      TodoAppModel.userBoardIds.push(data.id);

      TodoAppController.updateData.listEditedId = null;
      TodoAppController.updateData.taskEditedId = null;

      TodoAppController.modelChanged();

      return data;
    });
  },
  createTaskList: function(userId, boardId){
    Api.createTaskList(userId, boardId, "")
    .then(data =>{
      TodoAppModel.addTaskList(boardId, data.id, data.title, data.tasks);

      TodoAppController.updateData.listEditedId = null;
      TodoAppController.updateData.taskEditedId = null;

      TodoAppController.modelChanged();
    });
  },
  createTask: function(userId, boardId, listId){
    Api.createTask(userId, boardId, listId, "", false)
    .then(data =>{
      TodoAppModel.addTask(boardId, listId, data.id, data.text, data.isDone);

      TodoAppController.updateData.listEditedId = null;
      TodoAppController.updateData.taskEditedId = null;

      TodoAppController.modelChanged();
    });
  },
  updateBoardTitle: function(userId, boardId, newTitle){
    Api.updateBoardTitle(userId, boardId, newTitle);

    TodoAppModel.getBoard(boardId).title = newTitle;

    TodoAppController.modelChanged();
  },
  updateTaskListTitle: function(userId, boardId, listId, newTitle){
    Api.updateTaskListTitle(userId, boardId, listId, newTitle);

    TodoAppModel.getTaskList(boardId, listId).title = newTitle;

    TodoAppController.updateData.listEditedId = listId;
    TodoAppController.updateData.taskEditedId = -1;

    TodoAppController.modelChanged();
  },
  updateTaskText: function(userId, boardId, listId, taskId, newText){
    Api.updateTaskText(userId, boardId, listId, taskId, newText);

    TodoAppModel.getTask(boardId, listId, taskId).text = newText;

    TodoAppController.updateData.listEditedId = listId;
    TodoAppController.updateData.taskEditedId = taskId;

    TodoAppController.modelChanged();
  },
  updateTaskIsDone: function(userId, boardId, listId, taskId, newIsDone){
    Api.updateTaskIsDone(userId, boardId, listId, taskId, newIsDone);

    TodoAppModel.getTask(boardId, listId, taskId).isDone = newIsDone;

    TodoAppController.updateData.listEditedId = listId;
    TodoAppController.updateData.taskEditedId = taskId;

    TodoAppController.modelChanged();
  },
  deleteTaskList: function(userId, boardId, listId){
    Api.deleteTaskList(userId, boardId, listId);

    TodoAppModel.getBoard(boardId).deleteTaskList(listId);

    TodoAppController.updateData.listEditedId = null;
    TodoAppController.updateData.taskEditedId = null;

    TodoAppController.modelChanged();
  },
  deleteTask: function(userId, boardId, listId, taskId){
    Api.deleteTask(boardId, listId, taskId);

    TodoAppModel.getTaskList(boardId, listId).deleteTask(taskId);

    TodoAppController.updateData.listEditedId = listId;
    TodoAppController.updateData.taskEditedId = -1;

    TodoAppController.modelChanged();
  }
}

export default TodoAppController;
