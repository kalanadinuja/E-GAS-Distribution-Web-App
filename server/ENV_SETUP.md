# Environment Setup

## .env File Configuration

The `.env` file has been created with the following configuration:

```env
# MongoDB Configuration
MONGO=mongodb://localhost:27017/egas-service

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure

# Email Configuration (for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=3000

# Database Name
DB_NAME=egas-service
```

## Setup Instructions

1. **MongoDB Setup:**
   - Install MongoDB on your system
   - Start MongoDB service
   - The database name will be `egas-service`

2. **JWT Secret:**
   - Change the JWT_SECRET to a secure random string
   - This is used for user authentication tokens

3. **Email Configuration (Optional):**
   - For password reset functionality
   - Use Gmail with App Password for better security

4. **Start the Server:**
   ```bash
   cd E-Gas/server
   npm install
   npm start
   ```

5. **Start the Client:**
   ```bash
   cd E-Gas/client
   npm install
   npm run dev
   ```

## Database Collections

The following collections will be created automatically:
- `users` - User accounts
- `orders` - Order management
- `employees` - Employee accounts
- `drivers` - Driver accounts
- `inventory` - Product inventory
- `tasks` - Delivery tasks
- `notifications` - System notifications
