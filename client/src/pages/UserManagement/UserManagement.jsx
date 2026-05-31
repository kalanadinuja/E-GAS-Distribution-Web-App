import React from 'react'
import UserTable from './Usertable';
import SideBar from '../../components/SideBar';
import { MdDownload } from 'react-icons/md';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useState, useEffect } from 'react';

export default function UserManagement() {

  const [userCount, setUserCount] = useState(0);

    useEffect(() => {
      fetchUsers();
    }, []);

    const fetchUsers = () => {
      fetch('http://localhost:3000/api/user/read')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.error('Failed to fetch users:', response.statusText);
            throw new Error('Failed to fetch users');
          }
        })
        .then(data => {
          const users = data.user;
          setUserCount(users.length);
    
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    };

    const generateReport = () => {
      let yPos = 150; // Define yPos here
    
      fetch('http://localhost:3000/api/user/read')
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.error('Failed to generate report:', response.statusText);
            throw new Error('Failed to generate report');
          }
        })
        .then(data => {
          const items = data.user;
        
    
          const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "letter"
          });
    
          const userSize = data.user.length.toString();
    
         
    
          const margin = 40;
    
          doc.setLineWidth(1);
          doc.setDrawColor(0, 90, 139);
          doc.line(30, 30, 580, 30); // Top line
          doc.line(30, 100, 580, 100); // second Top line
          doc.line(580, 780, 580, 30); // Right line
          doc.line(30, 680, 580, 680); // Bottom up line
          doc.line(30, 780, 580, 780); // Bottom line
          doc.line(30, 780, 30, 30); //leftlines
    
          // Title
          doc.setFontSize(30);
          doc.text("User Management Report", margin, 80);
          doc.setFontSize(15);
    
          
    
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 255);
          doc.text(`Registered users(${userSize})`, margin, 130);
          doc.setTextColor(0, 0, 0);
  
          // Inventory items section as a table    'User Name', 'Email', 'Phone Number', 'Address'
          const tableColumns = ["User Name", "Email", "Phone Number", "Address"];
          const tableData = items.map(item => [item.username, item.email, item.phonenumber, item.address]);
        
          doc.autoTable({
            startY: yPos,
            head: [tableColumns],
            body: tableData,
            theme: "grid",
            margin: { top: 10 },
            styles: { textColor: [0, 0, 0], fontStyle: "bold" , FontSize:"12"},
            columnStyles: {
              0: { fontStyle: "normal" },
              1: { fontStyle: "normal" },
              2: { fontStyle: "normal" },
              3: { fontStyle: "normal" }
            }
          });

          yPos += 580;
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 255);
        doc.text("E Gas Service (PVT) LTD", 180, yPos);
        doc.setTextColor(0);

        /*const formatDate = (datetimeString) => {
          const date = new Date(datetimeString);
          const formattedDate = ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')};
          return formattedDate;
        };

        yPos += 20;
        doc.setTextColor(100, 150, 255);
        doc.setFontSize(10);
        doc.text(`The live status of the inventory on `, margin, yPos);
        doc.setTextColor(0,255,0);
        doc.setFontSize(13);
        doc.text(` ${formatDate(new Date())}`, 190, yPos+1)*/


          
        doc.setTextColor(0, 100, 0)
    
    
          doc.save('UserReport.pdf');
        })
        .catch(error => {
          console.error('Error generating report:', error);
        });
    };
    

  return (
    <div className='flex'>
        <SideBar />
        <div className='flex-1'>
        <div className='bg-paleblue justify-between flex px-10 py-10'>
          <h1 className='text-4xl font-bold text-blue'>User Management Dashboard</h1>
          <div className='flex gap-6'>
            <button onClick={generateReport}  className="bg-white hover:bg-light-blue hover:text-white text-black border-2 border-light-blue font-semibold transition-all py-2 px-4 rounded-lg inline-flex items-center">
              <MdDownload className='text-2xl mr-2' />
              <span>Download Report</span>
            </button>
            <div className='flex gap-2 cursor-pointer'>
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold">
                <h1>Dinuja A.A.K IT23674394</h1>
              </div>
              <p className='text-xs '>User Manager</p>
            </div>
            </div>
          </div>
        </div>
        <div className='px-10 text-2xl font-semibold pt-5'>
          <span className=''>Registered user Count({userCount})</span>
        </div>
        <div className='flex items-center ml-10 justify-between mt-7'>
          <div className='flex gap-4'>
            <div className='bg-lighter-blue border-2 border-light-blue font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Registered user Count</p>
              <p className='text-center text-3xl font-bold'>{userCount}</p>
            </div>
          </div>
        </div>
        <UserTable />
        </div>
    </div>
    
  )
}
