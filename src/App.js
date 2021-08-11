import React from 'react';
import { Route, withRouter } from 'react-router-dom'; 
import './App.css'
import Login from './components/login/Login'; 
import Home from './components/home/Home'; 
import SpotifyLogin from './components/spotify-login/SpotifyLogin';
// import Home2 from './components/home/Home';
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
      user: {}, 
      audienceData: [], 
      songData: [],
      listenersWeekly: null, 
      listenersMonthly: null,
      streamsWeekly: null, 
      streamsMonthly: null, 
      followers: null, 
      topSongs: [], 
      spotifyCode: null
    }
  }

  audienceOnChange = (data) => {
    // for (let i = 1; i <= 30; i++) {
    //   this.state.audienceData.push(data[i].toLocaleString())
    // }
      this.state.audienceData.push(data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21], data[22], data[23], data[24], data[25], data[26], data[27], data[28], data[29], data[30]); 
  }

  songOnChange = (data) => {
    this.state.songData.push(data[1], data[2], data[3], data[4], data[5]); 
  }

  responseFacebook = (response) => {
    if (response.id) {
      this.setState({
        user: response
      }); 
      const audienceData = this.state.audienceData; 
      const songData = this.state.songData; 
      // console.log(data)
      let listenerCountWeekly = 0;
      let streamCountWeekly = 0; 

      for (let i = 0; i < 7; i++) {
          listenerCountWeekly += parseInt(audienceData[i][1]);
          streamCountWeekly += parseInt(audienceData[i][2]);
      };

      let listenerCountMonthly = 0; 
      let streamCountMonthly = 0; 
      for (let i = 0; i < audienceData.length; i++) {
          listenerCountMonthly += parseInt(audienceData[i][1]); 
          streamCountMonthly += parseInt(audienceData[i][2]); 
      };

      const totalFollowers = audienceData[0][3]; 

      // console.log(window.location.href); 
      const spotifyCode = window.location.href.split('='); 
      console.log(spotifyCode); 

      this.setState({
          listenersWeekly: listenerCountWeekly.toLocaleString(), 
          listenersMonthly: listenerCountMonthly.toLocaleString(), 
          streamsWeekly: streamCountWeekly.toLocaleString(), 
          streamsMonthly: streamCountMonthly.toLocaleString(), 
          followers: totalFollowers.toLocaleString(), 
          spotifyCode: spotifyCode[1]
      }); 
      this.props.history.push('/home')
    }
  }

  spotifyLogin = (event) => {
    event.preventDefault(); 
    fetch('http://localhost:8000/api/spotify-login', {
        method: 'GET', 
        headers: {
            'content-type': 'text/plain'
            // 'content-type': 'application/json'
        }
    })
    .then((res) => {
        console.log(res)
        if (!res.ok) {
            throw new Error()
        }
        return res.text(); 
    })
    .then((resText) => {
      // console.log(this.props.history)
      // this.props.history.push(`${resText}`); 
      // above didn't work, so I am now opening logged in user in new tab
      const win = window.open(`${resText}`, "_blank");
      // win.focus();
    })
    .catch((error) => {
        console.log(error + 'error with Spotify login'); 
    }); 

  }

  // listenersWeekly: null, 
  // listenersMonthly: null,
  // streamsWeekly: null, 
  // streamsMonthly: null, 
  // followers: null, 
  // topSongs: []

  render() {
    // console.log(this.state.user)
    // console.log(typeof window.location.href)
    return (
      <div className="App">
        <Route 
        exact path="/" 
        render={(props) => (
          <Login responseFacebook={this.responseFacebook} 
          audienceOnChange={this.audienceOnChange} 
          songOnChange={this.songOnChange} 
          handleAudienceSubmit={this.handleAudienceSubmit} />
        )}/>
        <Route 
        path="/spotify-login"
        render={(props) => (
          <SpotifyLogin 
            spotifyLogin={this.spotifyLogin}
          />
        )}/>
        <Route 
        path="/home"
        render={(props) => (
          <Home user={this.state.user}
          listenersWeekly={this.state.listenersWeekly}
          listenersMonthly={this.state.listenersMonthly}
          streamsWeekly={this.state.streamsWeekly}
          streamsMonthly={this.state.streamsMonthly}
          followers={this.state.followers}
          topSongs={this.state.topSongs}
          songData={this.state.songData}
          audienceData={this.state.audienceData}
          spotifyCode={this.state.spotifyCode} />
        )}/>
        {/* <Route 
        path="/home"
        render={(props) => (
          <Home user={this.state.user} />
        )}/> */}
      </div>
    );
  }
}

export default withRouter(App);
