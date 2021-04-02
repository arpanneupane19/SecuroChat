import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message as alert } from 'antd';
import { MessageTwoTone, ArrowRightOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Chat.css'
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import moment from 'moment';


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

function Chat({ socket }) {
    let { code } = useParams();
    console.log({ code });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [codeExists, setCodeExists] = useState(false);

    const fetchAPI = () => {
        fetch(`http://127.0.0.1:5000/${code}`).then(
            res => res.json()
        ).then(
            data => {
                let response = data.code;
                if (response === 'not found') {
                    setCodeExists(false);
                }

                if (response !== 'not found') {
                    setCodeExists(true);
                }

            }
        )
    }


    const sendMessage = () => {
        let username = localStorage.getItem('username')
        socket.emit('message', {
            sender: username,
            message: message,
            time: moment().format("h:mm a")
        })
    }

    useEffect(() => {
        socket.on('connect', () => {
            let username = localStorage.getItem('username');
            socket.emit('connectUser', (username))
            alert.success('You have connected!')
        })

        socket.on('sysMessage', (msg) => {
            alert.info(`${msg}`)
        })

        socket.on('redirect', (destination) => {
            window.location.replace(`/${destination}`)
        })


        socket.on('chat', (msg) => {
            if (msg.sender !== null && msg.message !== '') {
                alert.success(`${msg.sender}: ${msg.message}`);
            }
        })

        socket.on('inputMessage', () => {
            alert.warning('Please input a message!')
        })

    }, [])


    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>

            <div className='message-box'>
                <div className='messages-header'>
                    <p>Messages <MessageOutlined /></p>
                    <a className='leave-room' href='/' onClick={() => socket.emit('leftRoom', { code })}><p title='Leave Room'>Leave <ArrowRightOutlined /></p></a>
                </div>

                <div className='messages'>
                    <Message>
                        <Time></Time>
                        <MessageBody></MessageBody>
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

                            <Button title='Send Message' style={{ width: '100%', borderRadius: '4px' }} type="primary" htmlType="submit" onClick={() => sendMessage()}>
                                Send <SendOutlined />
                            </Button>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        </div >
    )
}



export default Chat
