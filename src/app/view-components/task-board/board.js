import React from 'react';
import { PageHeader, Input } from 'react-bootstrap';

var Masonry = require('react-masonry-component')(React);

import TaskList from './task-list';

const Board = React.createClass({
  getInitialState: function(){
    return({ updateTitleTimeout: null });
  },
  updateTitle: function(newTitle){
    this.props.updateBoardTitle(
      this.props.userId,
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
  render: function(){
    return(
      <div className="board">
        <Input
        ref="title"
        className="board-title"
        type="text"
        bsSize="large"
        defaultValue={this.props.title}
        placeholder="Add title..."
        onChange={this.startUpdateTitle}/>
          <Masonry
          className="masonry-grid"
          options={{
            percentPosition: true
          }}>
            {
              this.props.taskLists.map((taskList, index) =>
              <div
              className="masonry-grid-item"
              key={taskList.id}
              >
                <TaskList
                userId={this.props.userId}
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
              </div>)
            }
          </Masonry>
      </div>
    )
  }
})

export default Board;
