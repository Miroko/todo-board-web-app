import React from 'react';
import { Input, Button, Glyphicon } from 'react-bootstrap';

const Task = React.createClass({
  getInitialState: function(){
    return({
      updateTextTimeout: null,
      updateIsDoneTimeout: null
     });
  },
  componentDidMount(){
    this.adjustTextAreaToText();
  },
  adjustTextAreaToText: function(){
    const element = this.refs.taskText.refs.input;
    const style = window.getComputedStyle(element);
    const elementHeight = parseInt(style.height);
    if(element.scrollHeight != elementHeight){
      element.style.height = "auto"; //auto shrink
      element.style.height = String(element.scrollHeight) + "px";
    }
  },
  updateText: function(newText){
    this.props.updateTaskText(
      this.props.userId,
      this.props.boardId,
      this.props.listId,
      this.props.taskId,
      newText);
  },
  startUpdateText: function(){
    const newText = this.refs.taskText.refs.input.value;

    if(this.state.updateTextTimeout === null){
      //delete task if text empty
      if(newText === ""){
        this.props.deleteTask(
          this.props.userId,
          this.props.boardId,
          this.props.listId,
          this.props.taskId);
        return; //deleted -> return
      }
      //create new task if text added to empty
      if(this.props.text === ""){
        this.props.createTask(
          this.props.userId,
          this.props.boardId,
          this.props.listId,
          "",
          false);
      }
    }

    this.setState(prevState =>{
      window.clearTimeout(prevState.updateTextTimeout);
      return { updateTextTimeout: window.setTimeout(() =>{
        this.updateText(newText);
        this.setState({ updateTextTimeout: null });
      }, this.props.updateRate
      )};
    });

    this.adjustTextAreaToText();
  },
  updateIsDone: function(newIsDone){
    this.props.updateTaskIsDone(
      this.props.userId,
      this.props.boardId,
      this.props.listId,
      this.props.taskId,
      newIsDone);
  },
  startUpdateIsDone: function(){
    const newIsDone = !this.props.isDone;

    if(this.state.updateIsDoneTimeout === null){
      this.updateIsDone(newIsDone);
    }

    this.setState(prevState =>{
      window.clearTimeout(prevState.updateIsDoneTimeout);
      return { updateIsDoneTimeout: window.setTimeout(() =>{
        this.updateIsDone(newIsDone);
        this.setState({ updateIsDoneTimeout: null });
        }, this.props.updateRate
      )};
    });
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(this.props.updateData.taskEditedId === null) return true;
    else if(this.props.updateData.taskEditedId === this.props.taskId) return true;
    return false;
  },
  render: function(){
    const textAreaWithButton =
    <div className="task">
      <div className="text">
        <Input
        ref="taskText"
        type="textarea"
        placeholder={this.props.placeholder}
        defaultValue={this.props.text}
        onChange={this.startUpdateText}
        bsStyle={(()=>{
            if(this.props.isDone) return "success";
            else                  return null;
        })()}
        />
      </div>
      <div className="button-done">
        <Button
        onClick={this.startUpdateIsDone}
        disabled={this.props.text === "" ? true : false}
        bsStyle={(()=>{
            if(this.props.isDone) return "success";
            else                  return null;
        })()}
        >
          <Glyphicon glyph="ok" />
        </Button>
      </div>
    </div>
    return(textAreaWithButton);
  }
})

export default Task;
