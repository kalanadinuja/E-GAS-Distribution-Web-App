import mongoose from 'mongoose';
import Employee from './models/employee.model.js';
import 'dotenv/config';

const testEmployeeLogin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if employee exists
        const existingEmployee = await Employee.findOne({ email: 'piumali698@gmail.com' });
        
        if (!existingEmployee) {
            // Create a test employee
            const testEmployee = new Employee({
                empId: 'EMP001',
                name: 'Piumali Test',
                contactNo: 771234567,
                DOB: new Date('1990-01-01'),
                address: 'Test Address',
                email: 'piumali698@gmail.com',
                NIC: 1234567890,
                empRole: 'Admin',
                maritalStatus: 'Single',
                gender: 'Female'
            });
            
            await testEmployee.save();
            console.log('Test employee created:', testEmployee);
        } else {
            console.log('Employee already exists:', existingEmployee);
        }

        // Test login
        const loginTest = await Employee.findOne({ email: 'piumali698@gmail.com' });
        if (loginTest) {
            console.log('Login test - Employee found:', {
                email: loginTest.email,
                NIC: loginTest.NIC,
                name: loginTest.name
            });
            console.log('Use NIC as password:', loginTest.NIC);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

testEmployeeLogin();
