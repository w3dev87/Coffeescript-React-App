import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './App.css';
import TodoForm from './TodoForm';

import io from "socket.io-client";

var socket = io.connect('http://localhost:3000');

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.props.mappedAppState.socket = socket;
    this.toggleAddTodo = this.toggleAddTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
    socket.on('TodoAdded', (data) => {
      console.log('TodoAdded: '+JSON.stringify(data));
      this.props.showTodoAddedBySocket(data);
    });
  }

  toggleAddTodo(e){
    e.preventDefault();
     this.props.mappedToggleAddTodo();
  }

  addTodo(e){
      e.preventDefault();
      const form = document.getElementById('addTodoForm');
      if(form.todoText.value !== ""  && form.todoDesc.value !== ""){
        const socketData = {
          todoText: form.todoText.value,
          todoDesc: form.todoDesc.value
        }
        this.props.mappedAddTodo(socketData,socket);
      form.reset();
      }
      else{
        return ;
      }
  }

  render(){
    const appState = this.props.mappedAppState;
    return(
      <div>
        <div className = "header-container">
        <Navbar inverse  collapseOnSelect className="customNav" >
          <Navbar.Header>
            <Navbar.Brand>
              <div> Todo App </div>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to={{ pathname: '/', query: {  } }} onClick={this.toggleAddTodo}>
                <NavItem eventKey={1}>Add Todo</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="container">
      { appState.showAddTodo &&
        <TodoForm addTodo={this.addTodo} />
      }
      { this.props.children }
      </div>
    </div>
    );
  }
}
