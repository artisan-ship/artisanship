import React, { Component } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import requests from '../../scripts/requests';
import Auth from '../../modules/auth';
class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      valueUsername: '',
      valuePwd: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    if(event.target.type === 'password'){
      this.setState({valuePwd: event.target.value});
    }
    else {
      this.setState({valueUsername: event.target.value});
    }

  }

  handleSubmit(event) {
    requests.post('/login', {
      username: this.state.valueUsername,
      password: this.state.valuePwd
    }).then(({success,token,user}) => {
      if(success) {
        Auth.authenticateUser(token);
        window.location.href = "/admin/" + user._id;
      }
    })
    event.preventDefault();
  }

  render() {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            <Image src='/logo.png' /> Log-in to your account
          </Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input fluid icon='user' value={this.state.valueUsername} onChange={this.handleChange} iconPosition='left' placeholder='Username' />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={this.state.valuePwd}
                onChange={this.handleChange} 
              />
              <Button type='submit' color='teal' fluid size='large'>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <a href='#'>Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }

}


export default LoginForm