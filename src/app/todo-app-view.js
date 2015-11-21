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
  carouselOnSelect: function(selectedIndex, selectedDirection){
    if(selectedDirection === "next") TodoAppController.selectNextBoard();
    else if(selectedDirection === "prev") TodoAppController.selectPreviousBoard();
    else return;

    this.carouselShowSelectedBoard();
  },
  carouselShowSelectedBoard: function(){
    TodoAppController.sortSelectedBoardByUndoneTasks();
    this.setState({
      carouselIndex: 0,
      carouselDirection: null,
    });
  },
  addNewBoard: function(){
    TodoAppController.createBoard(this.state.model.userId)
    .then(board =>{
      TodoAppController.selectBoard(board.id);
      this.carouselShowSelectedBoard();
    });
  },
  addNewListToCurrentBoard: function(){
    TodoAppController.createTaskList(
      this.state.model.userId,
      TodoAppController.getSelectedBoard().id);
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
      <div>
        <Navbar className="app-navbar navbar-fixed-top">
          <Navbar.Header>
            <Navbar.Brand>
              Todo-Boards
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={this.addNewListToCurrentBoard}>New List</NavItem>
              <NavItem onClick={this.addNewBoard}>New Board</NavItem>
              <NavItem onClick={TodoAppController.sortSelectedBoardByUndoneTasks}>Sort</NavItem>
            </Nav>
            <Nav pullRight>
              <NavItem onClick={this.logout}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Carousel
        className="board-carousel"
        activeIndex={this.state.carouselIndex}
        direction={this.state.carouselDirection}
        onSelect={this.carouselOnSelect}
        >
          {
            TodoAppController.getBoardsForCarousel().map((board, index) =>
              <CarouselItem
              key={board.id}
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
      </div>
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
