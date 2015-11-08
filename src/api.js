import axios from 'axios';

export default {
  createBoard: function(userId, title){
    return axios.post('/api/user/'+userId+'/board', { title: title })
    .then(response =>{
      return response.data;
    });
  },
  createTaskList: function(userId, boardId, title){
    return axios.post('/api/user/'+userId+'/board/'+boardId+'/list', { title: title })
    .then(response =>{
      return response.data;
    });
  },
  createTask: function(userId, boardId, listId, taskText, isDone){
    return axios.post('/api/user/'+userId+'/board/'+boardId+'/list/'+listId+'/task', { text: taskText, isDone: isDone })
    .then(response =>{
      return response.data;
    });
  },

  getUser: function(userId){
    return axios.get('/api/user/'+userId)
    .then(response => {
      return response.data;
    });
  },
  getBoard: function(userId, boardId){
    return axios.get('/api/user/'+userId+'/board/'+boardId)
    .then(response => {
      return response.data;
    });
  },

  updateBoardTitle: function(userId, boardId, newTitle){
    return axios.put('/api/user/'+userId+'/board/'+boardId+'/title', { title: newTitle });
  },
  updateTaskListTitle: function(userId, boardId, listId, newTitle){
    return axios.put('/api/user/'+userId+'/board/'+boardId+'/list/'+listId+'/title', { title: newTitle });
  },
  updateTaskText: function(userId, boardId, listId, taskId, newText){
    return axios.put('/api/user/'+userId+'/board/'+boardId+'/list/'+listId+'/task/'+taskId+'/text', { text: newText });
  },
  updateTaskIsDone: function(userId, boardId, listId, taskId, newIsDone){
    return axios.put('/api/user/'+userId+'/board/'+boardId+'/list/'+listId+'/task/'+taskId+'/isDone/', { isDone: newIsDone });
  },

  deleteBoard: function(userId, boardId){
    return axios.delete('/api/user/'+userId+'/board/'+boardId);
  },
  deleteTaskList: function(userId, boardId, listId){
    return axios.delete('/api/user/'+userId+'/board/'+boardId+'/list/'+listId);
  },
  deleteTask: function(userId, boardId, listId, taskId){
    return axios.delete('/api/user/'+userId+'/board/'+boardId+'/list/'+listId+'/task/'+taskId);
  }
}
