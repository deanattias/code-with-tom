import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Typography, Box, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';

const socket = io('http://localhost:8080');

const CodeBlock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<string>('student'); // Default to 'student'
  const [code, setCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    // Fetch code block details
    fetch(`http://localhost:8080/api/code-blocks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setCode(data.code);
        socket.emit('join-room', id);
      });

    // Assign role based on server response
    socket.on('assign-role', (data) => {
      setRole(data.role);
    });

    // Real-time code updates
    socket.on('code-changed', (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socket.off('code-changed');
      socket.off('assign-role');
    };
  }, [id]);

  // Handle code changes and emit updates
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value ?? '';
    setCode(newCode);
    socket.emit('code-changed', { roomId: id, newCode });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin="auto"
      width="80%"
      padding="20px"
    >
      <Typography variant="h3" gutterBottom align="center">
        {title}
      </Typography>
      <Editor
        height="400px"
        width="1000px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          readOnly: role === 'mentor',
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'off',
        }}
      />
      <Box marginTop="20px">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <IconButton color="primary" aria-label="back to selection">
            <ArrowBack fontSize="large" />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default CodeBlock;
