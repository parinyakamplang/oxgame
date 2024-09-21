import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Game from './components/ox';
import { FloatButton, Button, Row, Col, Image } from 'antd';
import { LogoutOutlined, GoogleOutlined, InfoCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import Modal from 'react-modal';
import Rule from './components/rule';

Modal.setAppElement('#root');  

function App() {
    const [user, setUser] = useState(localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('user')) : null);
    const [profile, setProfile] = useState(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isRulesModalVisible, setIsRulesModalVisible] = useState(false);
    const [isLeaderboardModalVisible, setIsLeaderboardModalVisible] = useState(false);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            localStorage.setItem('access_token', codeResponse.access_token);  // Save token to localStorage
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token && !profile) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    localStorage.setItem('profile', JSON.stringify(res.data));  // Save profile to localStorage

                    // Send the profile info to the server
                    axios.post('http://localhost:5001/login', {
                        email: res.data.email,
                        name: res.data.name,
                    })
                    .then(serverRes => {
                        setProfile({ ...res.data });
                    })
                    .catch(serverErr => console.log(serverErr));
                })
                .catch((err) => {
                    console.log(err);
                    logOut();
                });
        }
    }, [user, profile]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.clear();  // Clear localStorage when logging out
        navigate('/');
    };

    // Show rules modal
    const showRules = () => {
        setIsRulesModalVisible(true);
        setIsLeaderboardModalVisible(false);
    };

    // Show leaderboard modal and fetch data
    const showLeaderboard = () => {
        axios.get('http://localhost:5001/')
            .then((res) => {
                setLeaderboard(res.data);
                setIsLeaderboardModalVisible(true);
                setIsRulesModalVisible(false);
            })
            .catch((err) => console.log(err));           
    };

    return (
        <div style={{ background: '#000', height: '100vh', backgroundImage: 'url(/star.gif)', backgroundSize: 'contain' }}>
            {profile ? (
                <>
                    <Row>
                        <Col sm={{ span: 24 }} md={{ span: 24 }}>
                            <center>
                                <Image preview={false} style={{ height: '300px', borderRadius: '30%', opacity: 0.5 }} src='/loco.png' />
                            </center>
                        </Col>
                        <Col sm={{ span: 1 }} md={{ span: 6 }}>
                            <Image preview={false} src='/xia-galaxy.gif' style={{ backgroundSize: 'cover', opacity: 0.4, borderRadius: '100%', width: '350px' }} />
                        </Col>
                        <Col sm={{ span: 22 }} md={{ span: 12 }}>
                            <Game profile={profile} />
                        </Col>
                        <Col sm={{ span: 1 }} md={{ span: 6 }}></Col>

                        <FloatButton
                            description="LogOut"
                            style={{ width: '60px', height: '40px', insetInlineEnd: '20%', backgroundColor: '#845EC2' }}
                            icon={<LogoutOutlined />} shape="square" onClick={logOut}
                        />

                        <FloatButton
                            description="Rules"
                            style={{ width: '60px', height: '40px', insetInlineEnd: '15%', backgroundColor: '#FF6F61' }}
                            icon={<InfoCircleOutlined />} shape="square" onClick={showRules}
                        />

                        <FloatButton
                            description="Leaderboard"
                            style={{ width: '60px', height: '40px', insetInlineEnd: '10%', backgroundColor: '#E92390' }}
                            icon={<TrophyOutlined />} shape="square" onClick={showLeaderboard}
                        />
                    </Row>

                    <Modal
                        isOpen={isRulesModalVisible}
                        onRequestClose={() => setIsRulesModalVisible(false)}
                        contentLabel="OX Game Rules"
                        style={{
                            overlay: {
                              backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent overlay
                            },
                            content: {
                              background: 'transparent',  // Transparent background
                              border: 'none',
                              inset: '50% auto auto 50%',
                              transform: 'translate(-50%, -50%)', // Center the modal
                              maxWidth: '500px',
                              textAlign: 'center',
                            },
                          }}
                    >
                        <Rule/>
                    </Modal>

                    <Modal
                        contentLabel="Player Leaderboard"
                        isOpen={isLeaderboardModalVisible}
                        onRequestClose={() => setIsLeaderboardModalVisible(false)}
                        style={{
                            overlay: {
                              backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent overlay
                            },
                            content: {
                              background: 'transparent',  // Transparent background
                              border: 'none',
                              inset: '50% auto auto 50%',
                              transform: 'translate(-50%, -50%)', // Center the modal
                              maxWidth: '500px',
                              textAlign: 'center',
                            },
                          }}
                    >
                        <Leaderboard leaderboard={leaderboard} />
                    </Modal>
                </>
            ) : (
                <Row>
                    <Col sm={{ span: 1 }} md={{ span: 12 }} style={{ color: '#FFF' }}>
                        <center style={{ marginTop: '35%' }}>
                            <h1 className='neonTextg' style={{ color: '#FFF', fontSize: '48px' }}>{profile ? 'OX Game' : 'Welcome to OX Game'}</h1>
                            <br />
                            <Button onClick={() => login()} style={{ fontSize: '1.2rem', margin: '0.5rem', height: '3rem' }}>
                                <GoogleOutlined style={{ color: 'red' }} /> Sign in with Google
                            </Button>
                            <br /><br />
                            <h1 className='neonTextG'>Gamers!</h1>
                            <h3 className='neonTextG'>Finally, it's time to Compete with each other, grab your weapon, aim and get ready</h3>
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
