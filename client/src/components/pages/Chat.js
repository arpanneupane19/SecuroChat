import React, { useState, useParams } from 'react'
import { Form, Input, Button } from 'antd';
import { MessageTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Chat.css'
import { io } from 'socket.io-client'

const socket = io('http://127.0.0.1:5000');

socket.on('connect', () => {
    let connected = "You have connected!"
})

function Chat() {
    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>

            <div className='message-box'>
                <p></p>
            </div>
        </div>
    )
}

export default Chat
