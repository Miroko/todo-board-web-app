import React from 'react';
import { Panel, Input, Button } from 'react-bootstrap';
import TodoAppController from './../todo-app-controller'

const Login = React.createClass({
  getInitialState: function(){
    return({
      usernameValid: true,
      passwordValid: true
    });
  },
  tryLogin: function(){
    this.setState({
      usernameValid: true,
      passwordValid: true
    });

    const username = this.refs.username.refs.input.value;
    const password = this.refs.password.refs.input.value;

    if(username.length === 0){
      this.setState({ usernameValid: false })
    }
    else if(password.length === 0){
      this.setState({ passwordValid: false })
    }
    else{
      TodoAppController.getModel().reset();
      TodoAppController.loadInitialData(1);
    }
  },
  render: function() {
    return (
      <Panel className="login-panel">
         <Input
         ref="username"
         className="text-center"
         type="text"
         label="Username"
         bsStyle={()=>{
           if(this.state.usernameValid) return null
           else                         return "error"
         }()}
         />
         <Input
         ref="password"
         className="text-center"
         type="password"
         label="Password"
         bsStyle={()=>{
           if(this.state.passwordValid) return null
           else                         return "error"
         }()}
         />
         <Button
         className="login-button"
         block onClick={this.tryLogin}
         bsSize="large">
         Login
         </Button>
      </Panel>
    );
  }
})

export default Login;
