import React from 'react';
import { Route, withRouter } from 'react-router-dom'; 
import './App.css'
import Login from './components/login/Login'; 
import Home from './components/home/Home'; 
// The onlogin attribute on the button to set up a JavaScript callback that checks 
// the login status to see if the person logged in successfully:
/* <fb:login-button 
  scope="public_profile,email"
  onlogin="checkLoginState();">
</fb:login-button> */

// This is the callback. It calls FB.getLoginStatus() to get the most recent login state. 
// (statusChangeCallback() is a function that's part of the example that processes the response.)
// function checkLoginState() {
//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
//   });
// }

class App extends React.Component {
  constructor() {
    super(); 
    this.state = {
      isLoggedIn: false, 
      user: {}
    }
  }

  responseFacebook = (response) => {
    if (response.id) {
      this.setState({
        user: response
      }); 
      this.props.history.push('/')
    }
  }

  render() {
    console.log(this.state.user)
    return (
      <div className="App">
        <Route 
        exact path="/"
        render={(props) => (
          <Home user={this.state.user} />
        )}/>
        <Route 
        path="/login" 
        render={(props) => (
          <Login responseFacebook={this.responseFacebook} />
        )}/>
      </div>
    );
  }
}

export default withRouter(App);
