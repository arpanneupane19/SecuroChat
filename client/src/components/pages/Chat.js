import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import { MessageTwoTone, LockOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Chat.css'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from "styled-components";
import moment from 'moment';

const socket = io('http://127.0.0.1:5000')

function Chat() {
    let { code } = useParams();
    console.log({ code });
    const [message, setMessage] = useState('');

    socket.on('connect', () => {
        let username = localStorage.getItem('username')
        console.log("User has successfully connected.")
        socket.emit('connectUser', (username));
    })


    const Message = styled.div`
        background-color: rgb(0,140,255);
        padding: 8px;
        color: #fff;
        border-radius: 4px;
    `

    const Time = styled.div`
    `

    const MessageBody = styled.div`
    `

    socket.on('message', (message) => {
        console.log(`${message.message} was sent by ${message.sender} at ${message.time}.`)
    })

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
                    <Message>
                        <Time>2:14 pm</Time>
                        <MessageBody>Arpan: Hello world!</MessageBody>
                    </Message>
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
                                onChange={(e) => setMessage(e.target.value)}
                                style={{ borderRadius: '4px' }}
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

                            <Button style={{ width: '100%', borderRadius: '4px' }} type="primary" htmlType="submit" onClick={() => socket.emit('message', { message: message, sender: localStorage.getItem('username'), time: moment().format('h:mm a') })}>
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
