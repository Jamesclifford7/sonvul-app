import React from 'react'; 
import FacebookLogin from 'react-facebook-login'

function Login(props) {
    return (
        <main>
            <h1>Sonvul</h1>
            <h3>You must login with Facebook to continue</h3>
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
