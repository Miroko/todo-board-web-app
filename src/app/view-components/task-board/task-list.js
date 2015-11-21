import React from 'react';
import { Panel, Input, Button, Glyphicon } from 'react-bootstrap';

import Task from './task';

const List = React.createClass({
  getInitialState: function(){
    return({ updateTitleTimeout: null });
  },
  updateTitle: function(newTitle){
    this.props.updateTaskListTitle(
      this.props.userId,
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
      this.props.userId,
      this.props.boardId,
      this.props.listId);
  },
  shouldComponentUpdate: function(nextProps, nextState){
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
          <div>
            <div className="title-text">
              <Input
              bsSize="large"
              ref="title"
              type="text"
              placeholder="Add title..."
              defaultValue={this.props.title}
              onChange={this.startUpdatetitle}/>
            </div>
            <div className="button-remove">
              <Button
              onClick={this.removeList}
              bsStyle="danger">
                <Glyphicon glyph="remove" />
              </Button>
            </div>
          </div>
        }>
        {
         this.props.tasks.map((task, index) =>
         <Task
         key={task.id}
         userId={this.props.userId}
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
