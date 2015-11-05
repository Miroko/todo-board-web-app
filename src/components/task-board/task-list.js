import React from 'react';
import { Panel, Input, Button } from 'react-bootstrap';

import Task from './task';

const List = React.createClass({
  getInitialState: function(){
    return({ updateTitleTimeout: null });
  },
  updateTitle: function(newTitle){
    this.props.updateTaskListTitle(
      this.props.boardId,
      this.props.listId,
      newTitle);
  },
  startUpdatetitle: function(){
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
  removeList: function(){
    this.props.deleteTaskList(
      this.props.boardId,
      this.props.listId);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(this.props.updateData.listEditedId === null) return true;
    else if(this.props.updateData.listEditedId === this.props.listId) return true;
    return true;
  },
  render: function(){
    return(
      <Panel
      className="task-list"
      header=
        {
          <span className="input-group">
            <Input
            ref="title"
            type="text"
            placeholder="Add title..."
            defaultValue={this.props.title}
            onChange={this.startUpdatetitle}/>
            <span className="input-group-btn">
              <Button onClick={this.removeList}>Remove</Button>
            </span>
          </span>
        }>
        {
         this.props.tasks.map((task, index) =>
         <Task
         key={task.id}
         boardId={this.props.boardId}
         listId={this.props.listId}
         taskId={task.id}
         text={task.text}
         isDone={task.isDone}
         placeholder="Add new task..."

         //render
         updateRate={this.props.updateRate}
         updateData={this.props.updateData}

         //task functions
         createTask={this.props.createTask}
         updateTaskText={this.props.updateTaskText}
         updateTaskIsDone={this.props.updateTaskIsDone}
         deleteTask={this.props.deleteTask}
         />)
        }
      </Panel>
    )
  }
})

export default List;
