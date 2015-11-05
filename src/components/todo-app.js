import React from 'react';
import { Carousel, CarouselItem } from 'react-bootstrap';

import Api from '../api'
import Board from './task-board/board'
import TodoAppData from './todo-app-data'

const UpdateData = {
  //null = all
  //id = element with that id
  //-1 = none
  //null, null -> render all lists and tasks
  //list, null -> render single list without tasks
  //list, task -> render single task
  listEditedId: null,
  taskEditedId: null
};

const TodoApp = React.createClass({
  getInitialState: function(){
    return({
      index: 0,
      direction: null,
      data: TodoAppData,
      UpdateData });
  },
  handleSelect(selectedIndex, selectedDirection) {
    if(selectedDirection !== "next" && selectedDirection !== "prev") return;
    this.setState({
      index: selectedIndex,
      direction: selectedDirection
    });
  },
  render: function() {
    if(this.state.data.isEmpty()) return null;

    const board = this.state.data.getBoard(Number(this.props.params.boardId));

    return (
      <Carousel className="board-carousel" activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
        <CarouselItem index={0}>
          <Board
          boardId={board.id}
          title={board.title}
          taskLists={board.taskLists}

          //render
          updateRate={500}
          updateData={this.state.UpdateData}

          //board functions
          updateBoardTitle={this.updateBoardTitle}

          //list functions
          createTaskList={this.createTaskList}
          updateTaskListTitle={this.updateTaskListTitle}
          deleteTaskList={this.deleteTaskList}

          //task functions
          createTask={this.createTask}
          updateTaskText={this.updateTaskText}
          updateTaskIsDone={this.updateTaskIsDone}
          deleteTask={this.deleteTask}
          />
        </CarouselItem>
        <CarouselItem index={1}>
          <Board
          boardId={board.id}
          title={board.title}
          taskLists={board.taskLists}

          //render
          updateRate={500}
          updateData={this.state.UpdateData}

          //board functions
          updateBoardTitle={this.updateBoardTitle}

          //list functions
          createTaskList={this.createTaskList}
          updateTaskListTitle={this.updateTaskListTitle}
          deleteTaskList={this.deleteTaskList}

          //task functions
          createTask={this.createTask}
          updateTaskText={this.updateTaskText}
          updateTaskIsDone={this.updateTaskIsDone}
          deleteTask={this.deleteTask}
          />
        </CarouselItem>
      </Carousel>
    );
  },
  componentDidMount: function(){
    Api.getBoard(this.props.params.boardId)
    .then(data => {
      this.setState(prevState =>{
        prevState.data.reset();
        prevState.data.addBoard(data.id, data.title, data.taskLists);
        prevState.data.getBoard(data.id).sortByUndoneTasks();
        return { data: prevState.data };
      });

      UpdateData.listEditedId = null;
      UpdateData.taskEditedId = null;
      this.setState({ UpdateData });
    });
  },
  //Board functions
  updateBoardTitle: function(boardId, newTitle){
    Api.updateBoardTitle(boardId, newTitle);

    this.setState(prevState =>{
      prevState.data.getBoard(boardId).title = newTitle;
      return { data: prevState.data };
    });
  },
  //List functions
  createTaskList: function(boardId){
    Api.createTaskList(boardId, "")
    .then(data =>{
      this.setState(prevState =>{
        prevState.data.addTaskList(boardId, data.id, data.title, data.tasks);
        return { data: prevState.data };
      });

      UpdateData.listEditedId = null;
      UpdateData.taskEditedId = null;
      this.setState({ UpdateData });
    });
  },
  updateTaskListTitle: function(boardId, listId, newTitle){
    Api.updateTaskListTitle(boardId, listId, newTitle);

    this.setState(prevState =>{
      prevState.data.getTaskList(boardId, listId).title = newTitle;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = -1;
    this.setState({ UpdateData });
  },
  deleteTaskList: function(boardId, listId){
    Api.deleteTaskList(boardId, listId);

    this.setState(prevState =>{
      prevState.data.getBoard(boardId).deleteTaskList(listId);
      return { data: prevState.data };
    });

    UpdateData.listEditedId = null;
    UpdateData.taskEditedId = null;
    this.setState({ UpdateData });
  },

  //Task functions
  createTask: function(boardId, listId){
    Api.createTask(boardId, listId, "", false)
    .then(data =>{
      this.setState(prevState =>{
        prevState.data.addTask(boardId, listId, data.id, data.text, data.isDone);
        return { data: prevState.data };
      });

      UpdateData.listEditedId = null;
      UpdateData.taskEditedId = null;
      this.setState({ UpdateData });
    });
  },
  updateTaskText: function(boardId, listId, taskId, newText){
    Api.updateTaskText(boardId, listId, taskId, newText);

    this.setState(prevState =>{
      prevState.data.getTask(boardId, listId, taskId).text = newText;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = taskId;
    this.setState({ UpdateData });
  },
  updateTaskIsDone: function(boardId, listId, taskId, newIsDone){
    Api.updateTaskIsDone(boardId, listId, taskId, newIsDone);

    this.setState(prevState =>{
      prevState.data.getTask(boardId, listId, taskId).isDone = newIsDone;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = taskId;
    this.setState({ UpdateData });
  },
  deleteTask: function(boardId, listId, taskId){
    Api.deleteTask(boardId, listId, taskId);

    this.setState(prevState =>{
      prevState.data.getTaskList(boardId, listId).deleteTask(taskId);
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = -1;
    this.setState({ UpdateData });
  }
});

export default TodoApp;
