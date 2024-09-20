import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Game from './components/ox';
import { FloatButton, Button, Row, Col, Image } from 'antd'
import { LogoutOutlined, GoogleOutlined } from '@ant-design/icons';
import './App.css';

function App() {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

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
                        // console.log('login',res.data)
                        // Send the profile info to the server
                        axios.post('http://localhost:5001/login', {
                            email: res.data.email,
                            name: res.data.name,
                        })
                            .then(serverRes => {
                                // Handle the score returned from the server
                                setProfile({ ...res.data });
                            })
                            .catch(serverErr => console.log(serverErr));
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.clear()
    };
   // background: 'linear-gradient(200deg,#008F7A,#008E9B, #0089BA, #0081CF,#2C73D2 ,#845EC2)'
    return (
        <div style={{ background: '#000', height: '100vh',backgroundImage: 'url(/star.gif)',backgroundSize: 'contain' }}>
            {profile ? (
                <>
                    <Row >
                    <Col sm={{ span: 24 }} md={{ span: 24 }}><center><Image preview={false } style={{height:'300px',borderRadius:'30%',opacity: 0.5}} src='/loco.png'/></center></Col>
                        <Col sm={{ span: 1 }} md={{ span: 6 }} >
                        <Image preview={false} src='/xia-galaxy.gif' style={{ backgroundSize: 'cover',opacity:0.4,borderRadius:'100%',width:'350px'}}/>
                        </Col>
                        <Col sm={{ span: 22 }} md={{ span: 12 }}>
                            <Game profile={profile} />
                        </Col>
                        <Col sm={{ span: 1 }} md={{ span: 6 }}>

                        </Col>
                        <FloatButton description="LogOut" style={{ width: '60px', height: '40px', insetInlineEnd: '20%', backgroundColor: '#845EC2' }}
                            icon={<LogoutOutlined />} shape="square" onClick={logOut} />
                    </Row>
                </>
            ) : (
                <Row>
                    <Col sm={{ span: 1 }} md={{ span: 12 }}  style={{ color: '#FFF' }} >
                        <center style={{ marginTop: '35%' }}>
                            <h1 className='neonTextg' style={{ color: '#FFF',fontSize:'48px' }}>{profile ? 'OX Game' : 'Welcome to OX Game'}</h1>
                            <br />
                            <Button onClick={() => login()} style={{ fontSize: '1.2rem', margin: '0.5rem', height: '3rem' }}>
                                <GoogleOutlined style={{ color: 'red' }} /> Sign in with Google
                            </Button>
                            <br /><br />
                            <h1 className='neonTextG'>Gamers! </h1>
                            <h3 className='neonTextG'> Finally, it's time to Compete with each other, grab your weapon, aim and get ready</h3>
                        </center>
                    </Col>
                    <Col sm={{ span: 22 }} md={{ span: 12 }}>
                        <Image src='/bg_2.jpg' height={'100vh'} preview={false} />
                    </Col>
                </Row>
            )}
        </div>
    );
}
export default App;
