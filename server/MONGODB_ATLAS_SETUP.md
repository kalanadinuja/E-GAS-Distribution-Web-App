# MongoDB Atlas Setup Guide

## 🔧 **How to Update .env File for MongoDB Atlas**

### **Current .env File:**
```env
MONGO=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
JWT_SECRET=4fba55e773b4e064b67d4406198a345b7a89efbeb890b0ae24a776ce6840b186
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### **Step 1: Get Your MongoDB Atlas Connection String**

1. **Login to MongoDB Atlas**: Go to https://cloud.mongodb.com/
2. **Select Your Project**: Click on your project
3. **Click "Connect"**: On your cluster, click the "Connect" button
4. **Choose "Connect your application"**
5. **Copy Connection String**: You'll see something like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 2: Update the .env File**

Replace the MONGO line in your .env file with your actual connection string:

**Example:**
```env
MONGO=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/egas-service?retryWrites=true&w=majority
```

**Important Notes:**
- Replace `<username>` with your MongoDB Atlas username
- Replace `<password>` with your MongoDB Atlas password
- Replace `<cluster-name>` with your actual cluster name (e.g., cluster0.abc123)
- Replace `<database-name>` with `egas-service` (or your preferred database name)

### **Step 3: Test the Connection**

After updating the .env file:

1. **Restart the server**:
   ```bash
   npm start
   ```

2. **Check for success message**:
   ```
   ✅ Connected to MongoDB
   Server is listening on port 3000
   ```

3. **Test the API**:
   - Go to http://localhost:3000/api/order
   - Should return: `{"success":true,"orders":[],"pagination":...}`

### **Common Issues & Solutions**

#### **Issue 1: Authentication Failed**
- **Problem**: Wrong username/password
- **Solution**: Double-check your Atlas credentials

#### **Issue 2: Network Access**
- **Problem**: IP not whitelisted
- **Solution**: In Atlas, go to "Network Access" → "Add IP Address" → "Add Current IP Address"

#### **Issue 3: Database Name**
- **Problem**: Database doesn't exist
- **Solution**: Atlas will create the database automatically when you first save data

### **Security Best Practices**

1. **Never commit .env to Git**: Add `.env` to your `.gitignore` file
2. **Use strong passwords**: Generate secure passwords for your Atlas user
3. **Limit network access**: Only allow specific IP addresses if possible
4. **Regular backups**: Enable automatic backups in Atlas

### **Example Final .env File**

```env
MONGO=mongodb+srv://myuser:MySecurePassword123@cluster0.abc123.mongodb.net/egas-service?retryWrites=true&w=majority
JWT_SECRET=4fba55e773b4e064b67d4406198a345b7a89efbeb890b0ae24a776ce6840b186
EMAIL_USER=myemail@gmail.com
EMAIL_PASS=myapppassword
```

### **Need Help?**

If you're still having issues:
1. Check the server console for error messages
2. Verify your Atlas cluster is running
3. Ensure your IP address is whitelisted
4. Double-check the connection string format
