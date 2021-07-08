import React from 'react'; 
import FacebookLogin from 'react-facebook-login';
import CSVReader from 'react-csv-reader'; 
import './Login.css';
import spotify1 from '../../images/Spotify_audience.png'; 
import spotify2 from '../../images/Spotify_music.png'; 

function Login(props) {
    return (
        <main>
            <h1>Sonvul</h1>
            <h3>Upload your Spotify data then login with Facebook to continue.</h3>
            <h4>Download audience data from Spotify for Artists then upload csv file here</h4>
            <CSVReader onFileLoaded={(data) => props.audienceOnChange(data)} />
            <img src={spotify1} alt="spotify audience screenshot" />
            <h4>Download song data from Spotify for Artists then upload csv file here</h4>
            <CSVReader onFileLoaded={(data) => props.songOnChange(data)} />
            <img src={spotify2} alt="spotify music screenshot" /><br/>
            {/* <button onClick={event => this.handleAudienceSubmit(event)}>Upload</button> */}
            <FacebookLogin
                // appId="1088597931155576"
                autoLoad={true}
                fields="name,email,picture"
                // onClick={componentClicked}
                callback={props.responseFacebook} 
                />
            {/* <div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
        </main>
    )
}; 

export default Login; 
