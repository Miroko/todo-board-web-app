import axios from 'axios';

export default {
  createBoard: function(title){
    return axios.post('/api/board', { title: title })
    .then(response =>{
      return response.data;
    });
  },
  createTaskList: function(boardId, title){
    return axios.post('/api/board/'+boardId+'/list', { title: title })
    .then(response =>{
      return response.data;
    });
  },
  createTask: function(boardId, listId, taskText, isDone){
    return axios.post('/api/board/'+boardId+'/list/'+listId+'/task', { text: taskText, isDone: isDone })
    .then(response =>{
      return response.data;
    });
  },

  getBoard: function(boardId){
    return axios.get('/api/board/'+boardId)
    .then(response => {
      return response.data;
    });
  },

  updateBoardTitle: function(boardId, newTitle){
    return axios.put('/api/board/'+boardId+'/title', { title: newTitle });
  },
  updateTaskListTitle: function(boardId, listId, newTitle){
    return axios.put('/api/board/'+boardId+'/list/'+listId+'/title', { title: newTitle });
  },
  updateTaskText: function(boardId, listId, taskId, newText){
    return axios.put('/api/board/'+boardId+'/list/'+listId+'/task/'+taskId+'/text', { text: newText });
  },
  updateTaskIsDone: function(boardId, listId, taskId, newIsDone){
    return axios.put('/api/board/'+boardId+'/list/'+listId+'/task/'+taskId+'/isDone/', { isDone: newIsDone });
  },

  deleteBoard: function(boardId){
    return axios.delete('/api/board/'+boardId);
  },
  deleteTaskList: function(boardId, listId){
    return axios.delete('/api/board/'+boardId+'/list/'+listId);
  },
  deleteTask: function(boardId, listId, taskId){
    return axios.delete('/api/board/'+boardId+'/list/'+listId+'/task/'+taskId);
  }
}
