import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import { MessageTwoTone, LockOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Chat.css'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:5000')

function Chat() {
    let { code } = useParams();
    console.log({ code });
    // const [message, setMessage] = useState('');
    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>

            <div className='message-box'>
                <div className='messages-header'>
                    <p>Messages <MessageOutlined /></p>
                </div>

                <div className='messages'>
                    <div className='message'>
                        <div>2:14 pm</div>
                        <div>Arpan: Hello world!</div>
                    </div>
                </div>


                <div className='message-form'>
                    <Form
                        style={{ marginTop: '20px', display: 'flex' }}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        size="large"
                    >
                        <Form.Item
                            placeholder="Message"
                            name="message"
                            style={{ textAlign: 'left !important', marginRight: '8px' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your message!',
                                },
                            ]}
                        >
                            <Input
                                // onChange={(e) => setMessage(e.target.value)}
                                prefix={
                                    <MessageTwoTone
                                        className="site-form-item-icon"
                                        style={{ marginRight: '8px' }}
                                    />
                                }
                                placeholder="Message"
                            />
                        </Form.Item>
                        <Form.Item
                        >
                            <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                                Send
                        </Button>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Chat

// onClick={() => socket.emit('message', { message: message, sender: localStorage.getItem('username') })}