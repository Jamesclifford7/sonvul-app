import React from 'react'; 

class SpotifyLogin extends React.Component {


    render() {
        return (
            <>
                <h1>Login with Spotify here</h1>
                <button onClick={event => this.props.spotifyLogin(event)}>Login</button>
            </>
        )
    }
}

export default SpotifyLogin