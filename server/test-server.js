import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Test auth route
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth endpoint is working!',
    receivedData: req.body 
  });
});

app.listen(3000, () => {
  console.log('Test server is running on port 3000');
  console.log('Test with: http://localhost:3000/api/test');
});




