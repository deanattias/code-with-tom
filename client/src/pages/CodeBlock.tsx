import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import { ArrowBack, School, Group, EmojiEmotions } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import Confetti from 'react-confetti';

// Interface to represent the code block data structure
interface CodeBlockData {
  title: string;
  code: string;
  solution: string;
}

const socket = io('http://localhost:8080');

const CodeBlock: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<string>('student');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');
  const [mentorCount, setMentorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Fetch the code block from the server or JSON file
    fetch(`http://localhost:8080/api/code-blocks/${id}`)
      .then((res) => res.json())
      .then((data: CodeBlockData) => {
        setTitle(data.title);
        setCode(data.code);
        setSolution(data.solution);
        socket.emit('join-room', id);
      });

    // Listen for role assignment
    socket.on('assign-role', (data) => {
      setRole(data.role);
      setWelcomeMessage(`You are logged in as a ${data.role}`);
      setOpenSnackbar(true);
    });

    // Listen for updated participant counts
    socket.on('user-counts', (counts) => {
      setMentorCount(counts.mentors);
      setStudentCount(counts.students);
    });

    // Update the editor content based on real-time changes
    socket.on('code-changed', (newCode: string) => {
      setCode(newCode);
    });

    return () => {
      socket.off('code-changed');
      socket.off('assign-role');
      socket.off('user-counts');
    };
  }, [id]);

  // Normalize the code by removing comments and extra whitespace
  const normalizeCode = (code: string): string => {
    const withoutComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    return withoutComments.replace(/\s+/g, '').replace(/\r\n/g, '\n').trim();
  };

  // Handle code changes and check for matching against the solution
  const handleCodeChange = (value: string | undefined) => {
    if (role !== 'mentor' && !isCompleted) {
      const newCode = value ?? '';
      const normalizedCode = normalizeCode(newCode);
      const normalizedSolution = normalizeCode(solution);

      // Update state and emit changes via socket
      setCode(newCode);
      socket.emit('code-changed', { roomId: id, newCode });

      // Check if the student's code matches the normalized solution
      if (normalizedCode === normalizedSolution) {
        setIsCompleted(true);
      }
    }
  };

  // Close the snackbar notification
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      position="relative"
    >
      <Typography variant="h3" gutterBottom align="center">
        {title}
      </Typography>

      {isCompleted && <Confetti width={window.innerWidth} height={window.innerHeight} style={{ position: 'fixed', top: 0, left: 0 }} />}

      {isCompleted && (
        <Box
          position="fixed"
          top="25%"
          left="33%"
          zIndex={4}
          sx={{
            transform: 'translate(-50%, -50%)',
            animation: 'smiley-pop 1s ease-out forwards',
          }}
        >
          <EmojiEmotions fontSize="large" sx={{ fontSize: '500px', color: 'yellow' }} />
        </Box>
      )}

      <Editor
        height="400px"
        width="1000px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          readOnly: role === 'mentor' || isCompleted,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'off',
        }}
      />

      <Box
        marginTop="20px"
        sx={{
          animation: isCompleted ? 'button-pop 0.5s ease-out forwards' : '',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <IconButton color="primary" aria-label="back to selection">
            <ArrowBack fontSize="large" />
          </IconButton>
        </Link>
      </Box>

      <Box
        position="fixed"
        bottom="20px"
        left="20px"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Logged in as: {role.charAt(0).toUpperCase() + role.slice(1)}
        </Typography>
        <Box display="flex" alignItems="center">
          <School fontSize="large" />
          <Typography sx={{ ml: 0.5 }}>{mentorCount}</Typography>
          <Group fontSize="large" sx={{ ml: 2 }} />
          <Typography sx={{ ml: 0.5 }}>{studentCount}</Typography>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          {welcomeMessage}
        </Alert>
      </Snackbar>

      {isCompleted && (
        <Snackbar
          open={isCompleted}
          autoHideDuration={6000}
          onClose={() => setIsCompleted(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success">
            Congratulations, you have successfully completed your task!
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CodeBlock;
