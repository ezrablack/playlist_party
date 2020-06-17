import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages'; 
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ( props ) => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:5010';

  useEffect(() => {
    // const { name } = props.name;
    
    socket = io(ENDPOINT);

    setName(props.name)

    socket.emit('join', { name }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
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
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} /> 
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;