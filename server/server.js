import express from 'express'
import dbCon from './utils/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import path from 'path';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import employeeRouter from './routes/employee.route.js'
import inventoryRouter from './routes/inventory.route.js'
import driverRouter from './routes/driver.route.js'
import taskRouter from './routes/task.route.js'
import notificationRouter from './routes/notififcation.route.js'
import orderRouter from './routes/order.route.js'
import 'dotenv/config';



const app = express()
dbCon()

const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/employee', employeeRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/driver', driverRouter)
app.use('/api/task', taskRouter);
app.use('/api/notification',notificationRouter);
app.use('/api/order', orderRouter);




// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the process using port ${PORT} or set a different PORT environment variable.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

console.log("MONGO_URI from .env:", process.env.MONGO_URI);
