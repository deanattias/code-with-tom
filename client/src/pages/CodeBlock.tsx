import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import { ArrowBack, School, Group, EmojiEmotions } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import Confetti from 'react-confetti';

interface CodeBlockData {
  title: string;
  code: string;
  solution: string;
}

export default function CodeBlock() {
  // Retrieve ID parameter from route
  const { id } = useParams<{ id: string }>();
  const socket = useRef<Socket | null>(null);

  // Define state hooks
  const [role, setRole] = useState<string>('student');
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [solution, setSolution] = useState('');
  const [mentorCount, setMentorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Initialize socket and fetch code block data
  useEffect(() => {
    socket.current = io();

    const fetchCodeBlockData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"; // Fallback to local backend if not set
        const res = await fetch(`${API_URL}/api/code-blocks/${id}`);
        const data: CodeBlockData = await res.json();
        setTitle(data.title);
        setCode(data.code);
        setSolution(data.solution);
        socket.current?.emit('join-room', id);
      } catch (error) {
        console.error("Error fetching code block data:", error);
      }
    };

    fetchCodeBlockData();

    // Define socket event handlers
    const handleAssignRole = (data: { role: string }) => {
      setRole(data.role);
      setWelcomeMessage(`You are logged in as a ${data.role}`);
      setOpenSnackbar(true);
    };

    const handleUserCounts = (counts: { mentors: number; students: number }) => {
      setMentorCount(counts.mentors);
      setStudentCount(counts.students);
    };

    // Set up socket event listeners
    socket.current?.on('assign-role', handleAssignRole);
    socket.current?.on('user-counts', handleUserCounts);
    socket.current?.on('code-changed', handleCodeChanged);

    // Clean up socket listeners on unmount
    return () => {
      socket.current?.off('assign-role', handleAssignRole);
      socket.current?.off('user-counts', handleUserCounts);
      socket.current?.off('code-changed', handleCodeChanged);
      socket.current?.disconnect();
    };
  }, [id]);

  const handleCodeChanged = (newCode: string) => {
    setCode(newCode);
  };

  // Normalize code by removing comments and extra whitespace
  const normalizeCode = (code: string): string => {
    const withoutComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
    return withoutComments.replace(/\s+/g, '').replace(/\r\n/g, '\n').trim();
  };

  // Handle code changes and check if it matches the solution
  const handleCodeChange = (value: string | undefined) => {
    if (role !== 'mentor' && !isCompleted) {
      const newCode = value ?? '';
      const normalizedCode = normalizeCode(newCode);
      const normalizedSolution = normalizeCode(solution);

      // Update code and notify via socket
      setCode(newCode);
      socket.current?.emit('code-changed', { roomId: id, newCode });

      // Check if student's code matches the solution
      if (normalizedCode === normalizedSolution) {
        setIsCompleted(true);
      }
    }
  };

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

      {/*Trigger confetti and a big smiley face on task completion*/}
      {isCompleted && (
        <>
          <Confetti width={window.innerWidth} height={window.innerHeight} style={{ position: 'fixed', top: 0, left: 0 }} />
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
        </>
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
        {/*Formatting role string to appear as Mentor || Student*/}
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

      {/*Completion notification triggered when student completes task*/}
      {isCompleted && (
        <Snackbar
          open={isCompleted}
          autoHideDuration={10000}
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
}