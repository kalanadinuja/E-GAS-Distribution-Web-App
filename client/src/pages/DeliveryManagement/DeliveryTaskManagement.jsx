import { useState, useEffect } from 'react';
import DeliveryTaskTable from './DeliveryTaskTable';
import { Link } from 'react-router-dom';
import { MdDownload } from 'react-icons/md';
import SideBar from '../../components/SideBar';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


export default function DeliveryTaskManagement() {
  const [taskCount, setTaskCount] = useState(0);
  const [deliveredTaskCount, setDeliveredTaskCount] = useState(0);
  const [notdeliveredTaskCount, setnotDeliveredTaskCount]= useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3000/api/task/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
          throw new Error('Failed to fetch tasks');
        }
      })
      .then(data => {
        const tasks = data.task;
        setTaskCount(tasks.length);
  
        const deliveredTaskCount = tasks.filter(task => task.deliStatus=== 'Delivered');
        const notdeliveredTaskCount = tasks.filter(task => task.deliStatus === 'Order Confirmed'|| task.deliStatus === 'On the way');
  
        setDeliveredTaskCount(deliveredTaskCount.length);
        setnotDeliveredTaskCount(notdeliveredTaskCount.length);
      })
      .catch(error => {
        console.error('Error fetching drivers:', error);
      });
  };

    const formatDate = (datetimeString) => {
        const date = new Date(datetimeString);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return formattedDate;
    };
  const generateReport = () => {
    let yPos = 150; // Define yPos here
    let xPos = 500; //Define the xpos
    fetch('http://localhost:3000/api/task/read')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to generate report:', response.statusText);
          throw new Error('Failed to generate report');
        }
      })
      .then(data => {
        const tasks = data.task;
        
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "letter"
        });

  
       const taskCount = data.task.length.toString();

  
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
        doc.text("Delivery Task Report", margin, 80);
        doc.setFontSize(15);
  
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);
        doc.text(`Total Tasks(${taskCount})`, margin, 130);
        doc.setTextColor(0, 0, 0);

        // Delivery task section as a table
        const tableColumns = ["Order ID", "Delivery Date", "Assigned Driver", "Delivery Status"];
        const tableData = tasks.map(task => [task.orderId, formatDate(task.deliDate), task.assignDriv, task.deliStatus]);
      
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
  
        // Counts section
        yPos += 450;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);
        doc.text("Counts", margin, yPos);
        doc.setTextColor(255, 0, 0);
        doc.setFontSize(12);
        yPos += 20;
        doc.text(`- Delivered Orders: ${deliveredTaskCount}`, margin, yPos);
        doc.setTextColor(0, 128, 0);
        yPos += 20;
        doc.text(`- To be delivered: ${notdeliveredTaskCount}`, margin, yPos);
  
        yPos += 90;
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 255);
        doc.text("E-GAS (PVT) LTD", margin, yPos);
        doc.setTextColor(0);

        yPos += 20;
        doc.setTextColor(100, 150, 255);
        doc.setFontSize(10);
        doc.text(`The live status of the delivery tasks on `, margin, yPos);
        doc.setTextColor(0,255,0);
        doc.setFontSize(13);
        doc.text(` ${formatDate(new Date())}`, 220, yPos+1);
        
        
        
      
        doc.setTextColor(0, 100, 0);
        doc.save('DeliveryTaskReport.pdf');
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
          <h1 className='text-4xl font-bold text-blue'>Task Management Dashboard</h1>
          <div className='flex gap-6'>
            <button onClick={generateReport} className="bg-white hover:bg-light-blue hover:text-white text-black border-2 border-light-blue font-semibold transition-all py-2 px-4 rounded-lg inline-flex items-center">
              <MdDownload className='text-2xl mr-2' />
              <span>Download Report</span>
            </button>
            <div className='flex gap-2 cursor-pointer'>
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between font-bold">
                <h1>Amaya Senavirathne IT23823198</h1>
              </div>
              <p className='text-xs '>Delivery Manager</p>
            </div>
            </div>
          </div>
        </div>
        <div className='px-10 text-2xl font-semibold pt-5'>
          <span className=''>Task Count({taskCount})</span>
        </div>
        <div className='flex items-center ml-10 justify-between mt-7'>
          <div className='flex gap-4'>
            <div className='bg-lighter-blue border-2 border-light-blue font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Task Count</p>
              <p className='text-center text-3xl font-bold'>{taskCount}</p>
            </div>
            <div className='bg-green-100 border-2 border-green-600 font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>Delivered orders</p>
              <p className='text-center text-3xl font-bold'>{deliveredTaskCount}</p>
            </div>
            <div className='bg-red-100 border-2 border-red-600 font-medium rounded-2xl w-fit px-14 p-8'>
              <p className='text-center text-lg'>To be delivered</p>
              <p className='text-center text-3xl font-bold'>{notdeliveredTaskCount}</p>
            </div>
          </div>
          <div className='flex flex-col gap-2 mr-10 text-sm text-center'>
            <div><Link to="/create-task" className='bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg inline-block w-full p-3'>Add New Task</Link></div>
            
          </div>
        </div>
        <DeliveryTaskTable />
      </div>
    </div>
  )
}
