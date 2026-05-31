import Employee from "../models/employee.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const addEmpoyee = async (req, res) => {
    try {
        const {empId, name, contactNo, DOB, address, email, NIC, empRole, maritalStatus, gender} = req.body
        
        const newEmployee = new Employee({
            empId, name, contactNo, DOB, address, email, NIC, empRole, maritalStatus, gender
        })
        await newEmployee.save()
        res.status(200).json({success:true, message:'Employee added successfully!', newEmployee})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:'Internal Server Error'})
    }
}

const getEmployee = async(req, res) => {
    try {
        const employee = await Employee.find()
        if(!employee) {
            return res.status(404).json({success:false, message:'Employee not found!'})
        }
        res.status(200).json({success:true, employee})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:'Internal Server Error'})
    }
}

const updateEmployee = async(req, res) => {
    try {
        const empId = req.params.id
        const updateEmployee = await Employee.findByIdAndUpdate(empId, req.body, {new:true})

        if(!updateEmployee) {
            return res.status(404).json({success:false, message:'Employee not found!'})
        }
        res.status(200).json({success:true, message:'Employee Updated Successfully!', updateEmployee})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:'Internal Server Error'})
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const empId = req.params.id
        const deleteEmployee = await Employee.findByIdAndDelete(empId)
        
        if(!deleteEmployee) {
            return res.status(404).json({success:false, message:'Employee not found!'})
        }
        res.status(200).json({success:true, message:'Employee Deleted Successfully!', deleteEmployee})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:'Internal server error'})
    }
}

const getUpdateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        if(!employee) {
            return res.status(404).json({success:false, message:'Employee not found!'})
        }
        res.status(200).json({success:true, employee})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:'Internal server error'})
    }
}

const signinEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        // Find employee by username (using empId as username) or email as fallback
        let employee = await Employee.findOne({ empId: username });
        
        // If not found by empId, try by email
        if (!employee) {
            employee = await Employee.findOne({ email: username });
        }
        
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Use NIC as password
        if (password !== employee.NIC.toString()) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                id: employee._id, 
                empId: employee.empId, 
                name: employee.name,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Remove password from response
        const { password: _, ...employeeInfo } = employee.toObject();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            employee: employeeInfo,
            token
        });

    } catch (error) {
        console.log('Signin error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export {addEmpoyee, getEmployee, updateEmployee, deleteEmployee, getUpdateEmployee, signinEmployee}