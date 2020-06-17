import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages'; 
import Input from '../Input/Input';
import InfoBar from '../Infobar/InfoBar'

import './Chat.css';

let socket;

const Chat = ( props ) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('')
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5010';

  useEffect(() => {
    const { name, room } = props;

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);
  
  useEffect(() => {

    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    }, [name, room]);
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} /> 
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;