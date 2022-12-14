import React, { Component, useEffect, useState } from 'react';

import './App.css';

import { w3cwebsocket } from 'websocket';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [room, setRoom] = useState('');
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');


  const client = new w3cwebsocket(`ws://127.0.0.1:8000/ws/chat/someroot/`)

  const handleChattySubmit = () => {
    setIsLoggedIn(true);
  }

  const handleStartChat = () => {
    client.send(JSON.stringify({
      type: 'message',
      message: value,
      username: username,
    }))
  }

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer)

      setMessages([
        ...messages,
        {
          msg: dataFromServer.message,
          user: dataFromServer.username,
        }
      ])
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        {/* <CssBaseline /> */}
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
          }}
        >
          {!isLoggedIn ?
            <>
              <Typography
                component='h1'
                variant='h5'
                color='text.secondary'
              >
                Chatty Room
              </Typography>
              <Box
                component='form'
                onSubmit={handleChattySubmit}
                noValidate
                // validated={true}
                sx={{ mt: 1 }}
                autoComplete='off'
              >
                <TextField
                  // error={room === '' ? 'error' : ''}
                  margin='normal'
                  required
                  fullWidth
                  id='room'
                  label='Room'
                  name='room'
                  autoComplete='room'
                  autoFocus
                  onChange={e => setRoom(e.target.value)}
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  name='username'
                  label='Username'
                  id='username'
                  onChange={e => setUsername(e.target.value)}
                // autoComplete='username'
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </>
            :
            <>
              <Paper
                style={{
                  height: 500,
                  maxHeight: 300,
                  // border:'1px solid lightgray'
                }}
                label='Paper'
              />
              <TextareaAutosize
                style={{
                  border: '1px solid lightgray',
                  margin: '1em 0 1em 0',
                  // height: 50,
                }}
                onChange={e => setValue(e.target.value)}
              />
              <Button
                type='submit'
                variant='contained'
                onClick={handleStartChat}
              >
                Start Chatting
              </Button>
            </>
          }
        </Box>
      </Container>
    </ThemeProvider>
  );
}
