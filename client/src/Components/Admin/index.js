import React, { Component } from 'react';
import Auth from '../../modules/auth';
import Nav from '../Nav/Nav';
import requests from '../../scripts/requests';

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    }
    componentDidMount() {
        requests.get(window.location.pathname + "?token=" + Auth.getToken()).then(({user}) => {
            this.setState({username: user.username})
        })}
    checkIfAuth(){
        if(Auth.isUserAuthenticated()) {
            return (
                <h1>ADMIN</h1>
            )
        }else{
            console.log('issue')
            window.location.href = "/login"
        }
    }
    render() {
        return (
            
         
            <div>
            <Nav username={this.state.username}/>
               {this.checkIfAuth()}
            </div>
        )
    }
}
export default Admin;