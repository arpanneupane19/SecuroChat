import React, { useState } from 'react'
import './Form.css'
import { MessageTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';

function Home({ socket }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [codeExists, setCodeExists] = useState(false);

    const fetchAPI = () => {
        fetch(`http://127.0.0.1:5000/${code}`).then(
            res => res.json()
        ).then(
            data => {
                let response = data.code;
                if (response === 'not found') {
                    socket.emit('createRoom', { user: name, code: code }) && socket.on('redirect', (destination) => { window.location.replace(`/${destination}`) })
                }

                if (response !== 'not found') {
                    console.log('exists')
                    setCodeExists(true);
                    message.error('Room code already exists.')
                }

            }
        )
    }

    localStorage.setItem('username', name);

    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>
            <div className='form'>
                <p>Create Room</p>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    size="large"
                >
                    <Form.Item
                        placeholder="name"
                        name="name"
                        style={{ textAlign: 'left !important' }}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            prefix={
                                <UserOutlined
                                    className="site-form-item-icon"
                                    style={{ marginRight: '8px' }}
                                />
                            }
                            placeholder="Name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="roomCode"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the room code!',
                            },
                        ]}
                    >
                        <Input
                            onChange={(e) => setCode(e.target.value)}
                            prefix={
                                <LockOutlined
                                    className="site-form-item-icon"
                                    style={{ marginRight: '8px' }}
                                />
                            }
                            placeholder="Room Code"
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto', marginTop: '8px' }}
                    >
                        <Button style={{ width: '100%', borderRadius: '7.5px' }} type="primary" htmlType="submit" onClick={() => fetchAPI()}>
                            Create Room
                        </Button>
                    </Form.Item>
                </Form>
                <div className='link'>
                    Need to join a room? Click <Link to='/join'>here</Link>.
                </div>
            </div>
        </div >
    )
}

export default Home;