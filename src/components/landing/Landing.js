import React from 'react'; 
import FacebookLogin from 'react-facebook-login';
import CSVReader from 'react-csv-reader'; // npm package: https://www.npmjs.com/package/react-csv-reader
import './Landing.css';
import spotify1 from '../../images/Spotify_audience.png'; 
import spotify2 from '../../images/Spotify_music.png'; 
import concert1 from '../../images/concert1.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faSpotify, faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMusic, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Login(props) {
    return (
        <main>
            <h1>Sonvul</h1>
            <div className="landing">
                <p>Welcome to Sonvul, a DIY marketing tool for independent artists. Create a customized marketing plan based on your social and streaming data to reach more fans, promote the right content, and grow your audience organically. Follow the instructions below to begin!</p>
                {/* <p>Welcome to Sonvul! Track all of your social and streaming metrics in one place. Download the csv files from your Spotify for Artists account, connect your artist Instagram account, and then explore your data. Use Sonvul to tailor your marketing campaigns to specific cities and demographics, track your engagement, and discover which songs to promote to your followers.</p> */}
            </div>
            <h2>How it works</h2>
            <div className="instructions">
                <div className="instruction">
                    <FontAwesomeIcon icon={faSpotify} />
                    <h3>1. Login with Spotify below</h3>
                </div>
                {/* <div className="instruction arrow">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div> */}
                <div className="instruction">
                    <FontAwesomeIcon icon={faFacebook} />
                    <h3>2. Upload your Spotify data and login with Facebook/Instagram</h3>
                </div>
                {/* <div className="instruction arrow">
                    <FontAwesomeIcon icon={faArrowRight} />
                </div> */}
                <div className="instruction">
                    <FontAwesomeIcon icon={faMusic} />
                    <h3>3. Access your customized marketing campaign</h3>
                </div>
            </div>
            <div className="login-spotify">
                <h4>Login with Spotify</h4>
                <button onClick={event => props.spotifyLogin(event)} >Login</button>
                {/* <FacebookLogin
                    // appId="1088597931155576"
                    autoLoad={true}
                    fields="name,email,picture"
                    // onClick={componentClicked}
                    callback={props.responseFacebook} 
                /> */}
            </div>
        </main>
    )
}; 

export default Login; 
