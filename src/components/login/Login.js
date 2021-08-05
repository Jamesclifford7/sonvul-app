import React from 'react'; 
import FacebookLogin from 'react-facebook-login';
import CSVReader from 'react-csv-reader'; // npm package: https://www.npmjs.com/package/react-csv-reader
import './Login.css';
import spotify1 from '../../images/Spotify_audience.png'; 
import spotify2 from '../../images/Spotify_music.png'; 
import concert1 from '../../images/concert1.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons';

function Login(props) {
    return (
        <main>
            {/* <h1>Sonvul <FontAwesomeIcon icon={faBolt}/></h1> */}
            <h1>Sonvul</h1>
            <div className="landing">
                <p>Welcome to Sonvul, a DIY marketing tool for independent artists. Create a customized marketing plan based on your social and streaming data to reach more fans, promote the right content, and grow your audience organically. Upload your Spotify for Artists csv files and connect your Instagram account to begin!</p>
                {/* <p>Welcome to Sonvul! Track all of your social and streaming metrics in one place. Download the csv files from your Spotify for Artists account, connect your artist Instagram account, and then explore your data. Use Sonvul to tailor your marketing campaigns to specific cities and demographics, track your engagement, and discover which songs to promote to your followers.</p> */}
            </div>
            <div className="login">
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
            </div>
            {/* <div class="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false"></div> */}
        </main>
    )
}; 

export default Login; 
