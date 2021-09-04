import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Menu } from 'semantic-ui-react'
import Nav from './Components/Nav/Nav'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginForm from "./Components/Login/LoginForm";
import Admin from './Components/Admin';

class App extends Component {
  state = {
    data: null,
    activeItem: 'closest'
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
    return (

      <div>
        <Router>
    
          <Switch>
            <Route path="/login">
              <LoginForm />
            </Route>
            <Route path="/admin/:id">
              <Admin />
            </Route>
            <Route path="/">
              <Container>
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                  ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                  magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                  ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                  quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                  arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                  Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                  dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                  Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                  Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                  viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                  Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>

                <div className="App">
                  <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">{this.state.data}</h1>
                  </header>

                </div>
              </Container>
            </Route>

          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

