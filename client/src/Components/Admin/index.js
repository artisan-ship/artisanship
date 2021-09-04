import React, { Component } from 'react';
import Auth from '../../modules/auth';

class Admin extends React.Component {
    checkIfAuth(){
        if(Auth.isUserAuthenticated()) {
            return (
                <h1>ADMIN</h1>
            )
        }
    }
    render() {
        return (
            <div>
               {this.checkIfAuth()}
            </div>
        )
    }
}
export default Admin;