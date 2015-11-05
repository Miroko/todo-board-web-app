import React from 'react';
import { Panel, Grid, Row, Col, Button, PageHeader, Input } from 'react-bootstrap';

import TaskList from './task-list';

const Board = React.createClass({
  getInitialState: function(){
    return({ updateTitleTimeout: null });
  },
  updateTitle: function(newTitle){
    this.props.updateBoardTitle(
      this.props.boardId,
      newTitle);
  },
  startUpdateTitle: function(){
    const newTitle = this.refs.title.refs.input.value;

    this.setState(prevState =>{
      window.clearTimeout(prevState.updateTitleTimeout);
      return { updateTitleTimeout: window.setTimeout(() =>{
        this.updateTitle(newTitle);
        this.setState({ updateTitleTimeout: null });
        }, this.props.updateRate
      )};
    });
  },
  addNewList: function(){
    this.props.createTaskList(
      this.props.boardId);
  },
  render: function(){
    return(
      <span className="board">
        <Input
        ref="title"
        className="text-center"
        type="text"
        bsSize="large"
        defaultValue={this.props.title}
        placeholder="Add title..."
        onChange={this.startUpdateTitle}/>
        <Grid className="board-grid">
          {
            this.props.taskLists.map((taskList, index) =>
            <Col className="board-grid-cell" key={taskList.id} xs={6} sm={6} md={4} lg={3} >
              <TaskList
              key={taskList.id}
              boardId={this.props.boardId}
              listId={taskList.id}
              title={taskList.title}
              tasks={taskList.tasks}

              //render
              updateRate={this.props.updateRate}
              updateData={this.props.updateData}

              //list functions
              updateTaskListTitle={this.props.updateTaskListTitle}
              deleteTaskList={this.props.deleteTaskList}

              //task functions
              createTask={this.props.createTask}
              updateTaskText={this.props.updateTaskText}
              updateTaskIsDone={this.props.updateTaskIsDone}
              deleteTask={this.props.deleteTask}
              />
            </Col>)
          }
          <Col className="board-grid-cell" xs={12}>
            <Button bsSize="large" onClick={this.addNewList}>Add new list</Button>
          </Col>
        </Grid>
      </span>
    )
  }
})

export default Board;
