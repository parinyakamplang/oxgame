import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Game from './components/ox';
import {FloatButton, Button, Row, Col} from 'antd'
import { LogoutOutlined, GoogleOutlined } from '@ant-design/icons';

function App() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
  

    useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile(res.data);
                      // Send the profile info to the server
                      axios.post('http://localhost:5001/login', {
                          email: res.data.email,
                          name: res.data.name
                      })
                      .then(serverRes => {
                          // Handle the score returned from the server
                          setProfile({...res.data, score: serverRes.data.score});
                      })
                      .catch(serverErr => console.log(serverErr));
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );
  


    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <>
        <Row style={{marginTop:'10%'}} justify="center">
        <Col sm={{span: 1 }} md={{ span: 8}}></Col>
        <Col sm={{span: 22 }} md={{ span: 8}} 
        >
           {profile ? (<center><h2> OX Game</h2></center>):(<center><h2>Login</h2></center>)}
        </Col>
        <Col sm={{span: 1 }} md={{ span: 8}}></Col>
        </Row>
            <br />
            <br />
            {profile ? (
                <Row>
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}>
                      {/* <p>Name: {profile.name}</p>
                      <p>Email Address: {profile.email}</p>
                      <p>Score: {profile.score}</p> */}
                    </Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>
                    <br />
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}>
                    <Game profile={profile} />
                      </Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>
                    <br />
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}><FloatButton type="primary" description="LogOut" style={{ width:'60px',height:'60px', insetInlineEnd: '20%' }}
                    icon={<LogoutOutlined />} shape="square" onClick={logOut}/></Col>
                    <Col sm={{span: 1 }} md={{ span: 8}}></Col>

                </Row>
            ) : (
            <Row>
            <Col sm={{span: 1 }} md={{ span: 8}}></Col>
            <Col sm={{span: 22 }} md={{ span: 8}}
            >
               <Button onClick={() => login()}><GoogleOutlined /> Sign in with Google </Button></Col>
            <Col sm={{span: 1 }} md={{ span: 8}}></Col>
            </Row>
            )}
        </>
    );
}
export default App;
