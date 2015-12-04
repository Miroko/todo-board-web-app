import axios from "axios";

export default {
  createBoard: function(userId){
    return axios.post("/api/user/"+userId+"/board")
    .then(response =>{
      return response.data;
    });
  },
  createTaskList: function(userId, boardId){
    return axios.post("/api/user/"+userId+"/board/"+boardId+"/taskList")
    .then(response =>{
      return response.data;
    });
  },
  createTask: function(userId, boardId, listId){
    return axios.post("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId+"/task")
    .then(response =>{
      return response.data;
    });
  },

  getUser: function(userId){
    return axios.get("/api/user/"+userId)
    .then(response => {
      return response.data;
    });
  },
  getBoard: function(userId, boardId){
    return axios.get("/api/user/"+userId+"/board/"+boardId)
    .then(response => {
      return response.data;
    });
  },

  updateBoardTitle: function(userId, boardId, newTitle){
    return axios.patch("/api/user/"+userId+"/board/"+boardId, { title: newTitle });
  },
  updateTaskListTitle: function(userId, boardId, listId, newTitle){
    return axios.patch("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId, { title: newTitle });
  },
  updateTaskText: function(userId, boardId, listId, taskId, newText){
    return axios.patch("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId+"/task/"+taskId, { text: newText });
  },
  updateTaskIsDone: function(userId, boardId, listId, taskId, newIsDone){
    return axios.patch("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId+"/task/"+taskId, { isDone: newIsDone });
  },

  deleteBoard: function(userId, boardId){
    return axios.delete("/api/user/"+userId+"/board/"+boardId);
  },
  deleteTaskList: function(userId, boardId, listId){
    return axios.delete("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId);
  },
  deleteTask: function(userId, boardId, listId, taskId){
    return axios.delete("/api/user/"+userId+"/board/"+boardId+"/taskList/"+listId+"/task/"+taskId);
  }
};
