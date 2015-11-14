import React from 'react';
import { Carousel, CarouselItem, Navbar, Nav, NavItem } from 'react-bootstrap';

import TodoAppController from './todo-app-controller'
import Login from './view-components/login'
import Board from './view-components/task-board/board'

const TodoAppView = React.createClass({
  getInitialState: function(){
    return({
      carouselIndex: 0,
      carouselDirection: null,
      model: null,
    });
  },
  carouselOnSelect: function(selectedIndex, selectedDirection) {
    if(selectedDirection === "next") TodoAppController.selectNextBoard();
    else if(selectedDirection === "prev") TodoAppController.selectPreviousBoard();
    else return;

    this.carouselSlideTo(selectedIndex, selectedDirection);
  },
  carouselSlideTo: function(index, slideDirection){
    TodoAppController.getCurrentBoard().sortByUndoneTasks();

    this.setState({
      carouselIndex: index,
      carouselDirection: slideDirection
    });
  },
  addNewListToCurrentBoard: function(){
    TodoAppController.createTaskList(
      this.state.model.userId,
      TodoAppController.getCurrentBoard().id);
  },
  addNewBoard: function(){
    TodoAppController.createBoard(this.state.model.userId)
    .then(board =>{
      const index = TodoAppController.selectBoard(board.id);
      this.carouselSlideTo(index, "next");
    });
  },
  logout: function(){
    TodoAppController.getModel().userId = null;
    this.onModelChange();
  },
  render: function(){
    if(TodoAppController.getCurrentUserId() === null){
      return(
        <Login/>
      );
    }

    if(this.state.model === null) return null;
    return (
      <span>
        <Navbar className="navbar-fixed-top">
          <Nav>
            <NavItem className="btn" onClick={this.addNewListToCurrentBoard}>New List</NavItem>
            <NavItem className="btn" onClick={this.addNewBoard}>New Board</NavItem>
          </Nav>
          <Nav right>
            <NavItem className="btn" onClick={this.logout}>Logout</NavItem>
          </Nav>
        </Navbar>
        <Carousel
        className="board-carousel"
        activeIndex={this.state.carouselIndex}
        direction={this.state.carouselDirection}
        onSelect={this.carouselOnSelect}>
          {
            TodoAppController.getBoardsForCarousel().map((board, index) =>
              <CarouselItem
              key={index}
              index={index}>
                <Board
                userId={this.state.model.userId}
                boardId={board.id}
                title={board.title}
                taskLists={board.taskLists}

                //render
                updateRate={500}
                updateData={TodoAppController.getUpdateData()}

                //board functions
                updateBoardTitle={TodoAppController.updateBoardTitle}

                //list functions
                createTaskList={TodoAppController.createTaskList}
                updateTaskListTitle={TodoAppController.updateTaskListTitle}
                deleteTaskList={TodoAppController.deleteTaskList}

                //task functions
                createTask={TodoAppController.createTask}
                updateTaskText={TodoAppController.updateTaskText}
                updateTaskIsDone={TodoAppController.updateTaskIsDone}
                deleteTask={TodoAppController.deleteTask}
                />
              </CarouselItem>)
          }
        </Carousel>
      </span>
    );
  },
  componentDidMount: function(){
    TodoAppController.setModelChangeListener(this.onModelChange);
  },
  onModelChange: function(){
    this.setState({ model: TodoAppController.getModel() });
  }
});

export default TodoAppView;
