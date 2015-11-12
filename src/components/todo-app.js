import React from 'react';
import { Carousel, CarouselItem, Navbar, Nav, NavItem } from 'react-bootstrap';

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
  carouselOnSelect: function(selectedIndex, selectedDirection) {
    if(selectedDirection === "next") this.state.data.selectNextBoard();
    else if(selectedDirection === "prev") this.state.data.selectPreviousBoard();
    else return;

    this.carouselSlideTo(selectedIndex, selectedDirection);
  },
  carouselSlideTo: function(index, slideDirection){
    this.state.data.getCurrentBoard().sortByUndoneTasks();

    this.setState({
      index: index,
      direction: slideDirection
    });
  },
  addNewListToCurrentBoard: function(){
    this.createTaskList(
      this.state.data.userId,
      this.state.data.getCurrentBoard().id);
  },
  addNewBoardToCurrentBoard: function(){
    this.createBoard(this.state.data.userId)
    .then(board =>{
      const index = this.state.data.selectBoard(board.id);
      this.carouselSlideTo(index, "next");
    });
  },
  render: function() {
    if(this.state.data.isEmpty()) return null;

    return (
      <span>
        <Navbar className="navbar-fixed-top">
          <Nav>
            <NavItem className="btn" onClick={this.addNewListToCurrentBoard}>New List</NavItem>
            <NavItem className="btn" onClick={this.addNewBoardToCurrentBoard}>New Board</NavItem>
          </Nav>
        </Navbar>
        <Carousel
        className="board-carousel"
        activeIndex={this.state.index}
        direction={this.state.direction}
        onSelect={this.carouselOnSelect}>
          {
            this.state.data.getBoardsForCarousel().map((board, index) =>
              <CarouselItem
              key={index}
              index={index}>
                <Board
                userId={this.state.data.userId}
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
              </CarouselItem>)
          }
        </Carousel>
      </span>
    );
  },
  componentDidMount: function(){
    TodoAppData.reset();
    TodoAppData.loadUser(this.props.params.userId).then(loaded => {
      TodoAppData.loadBoards().then(loaded => {
        this.setState({ data: TodoAppData });

        UpdateData.listEditedId = null;
        UpdateData.taskEditedId = null;
        this.setState({ UpdateData });
      });
    });
  },
  createBoard: function(userId){
    return Api.createBoard(userId, "")
    .then(data =>{
      TodoAppData.addBoard(data.id, data.title, data.taskLists);
      TodoAppData.userBoardIds.push(data.id);
      this.setState({ data: TodoAppData });

      UpdateData.listEditedId = null;
      UpdateData.taskEditedId = null;
      this.setState({ UpdateData });

      return data;
    });
  },
  createTaskList: function(userId, boardId){
    Api.createTaskList(userId, boardId, "")
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
  createTask: function(userId, boardId, listId){
    Api.createTask(userId, boardId, listId, "", false)
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
  updateBoardTitle: function(userId, boardId, newTitle){
    Api.updateBoardTitle(userId, boardId, newTitle);

    this.setState(prevState =>{
      prevState.data.getBoard(boardId).title = newTitle;
      return { data: prevState.data };
    });
  },
  updateTaskListTitle: function(userId, boardId, listId, newTitle){
    Api.updateTaskListTitle(userId, boardId, listId, newTitle);

    this.setState(prevState =>{
      prevState.data.getTaskList(boardId, listId).title = newTitle;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = -1;
    this.setState({ UpdateData });
  },
  updateTaskText: function(userId, boardId, listId, taskId, newText){
    Api.updateTaskText(userId, boardId, listId, taskId, newText);

    this.setState(prevState =>{
      prevState.data.getTask(boardId, listId, taskId).text = newText;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = taskId;
    this.setState({ UpdateData });
  },
  updateTaskIsDone: function(userId, boardId, listId, taskId, newIsDone){
    Api.updateTaskIsDone(userId, boardId, listId, taskId, newIsDone);

    this.setState(prevState =>{
      prevState.data.getTask(boardId, listId, taskId).isDone = newIsDone;
      return { data: prevState.data };
    });

    UpdateData.listEditedId = listId;
    UpdateData.taskEditedId = taskId;
    this.setState({ UpdateData });
  },
  deleteTaskList: function(userId, boardId, listId){
    Api.deleteTaskList(userId, boardId, listId);

    this.setState(prevState =>{
      prevState.data.getBoard(boardId).deleteTaskList(listId);
      return { data: prevState.data };
    });

    UpdateData.listEditedId = null;
    UpdateData.taskEditedId = null;
    this.setState({ UpdateData });
  },
  deleteTask: function(userId, boardId, listId, taskId){
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
