import React from 'react'; 
import CSVReader from 'react-csv-reader';
import spotify1 from '../../images/Spotify_audience.png';
import spotify2 from '../../images/Spotify_music.png';
import './Login.css'; 
import FacebookLogin from 'react-facebook-login';

class SpotifyLogin extends React.Component {


    render() {
        return (
            <>
                <h1>Sonvul</h1>
                <div className="login">
                    <h2>Almost there! Upload your Spotify data then login with Facebook to continue.</h2>
                    <h4>Download audience data from Spotify for Artists then upload csv file here</h4>
                    <CSVReader onFileLoaded={(data) => this.props.audienceOnChange(data)} />
                    <img src={spotify1} alt="spotify audience screenshot" />
                    <h4>Download song data from Spotify for Artists then upload csv file here</h4>
                    <CSVReader onFileLoaded={(data) => this.props.songOnChange(data)} />
                    <img src={spotify2} alt="spotify music screenshot" /><br/>
                    <h4>Login with Facebook/Instagram</h4>
                    <FacebookLogin
                    // appId="1088597931155576"
                    autoLoad={true}
                    fields="name,email,picture"
                    // onClick={componentClicked}
                    callback={this.props.responseFacebook} 
                    />
                    {/* <button onClick={event => this.props.spotifyLogin(event)}>Login</button> */}
                </div>
            </>
        )
    }
}

export default SpotifyLogin