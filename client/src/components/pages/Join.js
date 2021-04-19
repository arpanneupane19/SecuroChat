import React, { useState } from 'react'
import './Form.css'
import { MessageTwoTone, LockOutlined, UserOutlined, QuestionOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import { Link, Redirect } from 'react-router-dom';


function Join({ socket }) {
    document.title = 'SecuroChat - Join Room'

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [codeExists, setCodeExists] = useState(false);
    const [visible, setVisible] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const showModal = () => {
        setVisible(true);
    }

    const closeModal = () => {
        setVisible(false);
    }

    const fetchAPI = () => {
        fetch(`/api/${code}`).then(
            res => res.json()
        ).then(
            data => {
                let response = data.code;
                let usersArr = data.users;
                if (response === 'not found') {
                    setCodeExists(false);
                    message.error('Room code does not exist.')
                }

                if (response !== 'not found') {
                    setCodeExists(true);
                    if (usersArr.indexOf(name) !== -1) {
                        message.error("User with that name already exists.")
                    }
                    if (code === name) {
                        message.error("Your name cannot be the same as the room code.")
                    }
                    else {
                        socket.emit('joinRoom', { user: name, code: code })
                        setRedirect(true);
                    }
                }

            }
        )
    }

    localStorage.setItem('username', name)

    if (redirect) {
        return <Redirect to={`/${code}`} />
    }
    return (
        <div className='container'>
            <div className='header'>
                <h1><MessageTwoTone /> SecuroChat <MessageTwoTone /></h1>
            </div>
            <div className='form'>
                <div className='form-header'>
                    <p>Join Room</p>
                    <Button onClick={showModal} shape="circle" icon={<QuestionOutlined style={{ color: 'darkslategray' }} />} />
                    <Modal title="Additional Information" visible={visible} onOk={closeModal} onCancel={closeModal}
                        footer={[
                            <Button type="primary" key="back" onClick={closeModal}>
                                OK
                            </Button>
                        ]}
                    >
                        <p>
                            To join a room, enter in a username, this is the name you'll be recognized by other people in the room.
                            Then enter in a valid room, it has to exist in order for you to join. Once you're in the room, you can chat
                            freely without worrying about privacy!
                        </p>

                        <div>
                            <p>"We don't store any of your data."</p>
                            <p>- <a href="http://arpanneupane.com" target="__blank">Arpan Neupane</a> (Creator of SecuroChat)</p>
                        </div>

                    </Modal>
                </div>
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
                            onChange={(e) => setName(e.target.value.trim())}
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
                            onChange={(e) => setCode(e.target.value.trim())}
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
                            Join Room
                        </Button>
                    </Form.Item>
                </Form>
                <div className='link'>
                    Need to create a room? Click <Link to='/create'>here</Link>.
                </div>
            </div>
        </div >
    )
}

export default Join;

