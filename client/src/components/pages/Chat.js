import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message as alert } from 'antd';
import { MessageTwoTone, ArrowRightOutlined, SendOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Chat.css'
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';

const Message = styled.div`
background-color: rgb(0,140,255);
padding: 8px;
color: #fff;
border-radius: 4px;
margin-bottom: 6px
`

const Time = styled.div`
`

const MessageBody = styled.div`
`

function Chat({ socket }) {
    let { code } = useParams();
    document.title = `SecuroChat - ${code}`
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [codeExists, setCodeExists] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [userTotal, setUserTotal] = useState(0);
    const [form] = Form.useForm();

    const fetchAPI = () => {
        fetch(`/api/${code}`).then(
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

        form.setFieldsValue({
            message: ''
        });
    }

    useEffect(() => {
        socket.emit('connectUser', (localStorage.getItem('username')))

        socket.on('sysMessage', (msg) => {
            alert.info(`${msg}`)
        })

        socket.on('chat', (msg) => {
            if (msg.sender !== null && msg.message !== '') {
                setMessages((currentMessages) => [...currentMessages, msg])
                setMessage('');
            }
        })

        socket.on('botChat', (msg) => {
            if (msg.sender !== null && msg.message !== '') {
                setMessages((currentMessages) => [...currentMessages, msg])
            }
        })
        socket.on('inputMessage', () => {
            alert.warning('Please input a message!')
        })

        socket.on('redirect', () => {
            setRedirect(true)
        })


        // set user total when joining/leaving
        socket.on('joined', (arr) => {
            setUserTotal(arr.length);
        })

        socket.on('left', (arr) => {
            setUserTotal(arr.length - 1);
        })

    }, [])


    if (localStorage.getItem('username') === "") {
        return <Redirect to={`/join`} />
    }

    if (redirect) {
        return <Redirect to={`/create`} />
    }

    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>

            <div className='message-box'>
                <div className='messages-header'>
                    <p>Messages <MessageOutlined /></p>
                    <p><UserOutlined /> {userTotal}</p>
                    <a href="/"><p title='Leave Room'>Leave <ArrowRightOutlined /></p></a>
                </div>

                <ScrollToBottom className='messages'>
                    {messages.map(msg =>
                        <Message key={msg.id}>
                            <Time>{msg.time}</Time>
                            <MessageBody>{msg.sender}: {msg.message}</MessageBody>
                        </Message>
                    )}
                </ScrollToBottom>


                <div className='message-form'>
                    <Form
                        form={form}
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