import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';

const AssignmentDashBoard = () => {
  const [assignments, setAssignments] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          // If access token is not found, set redirectToLogin to true
          setRedirectToLogin(true);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_RESPONDER_API_HOST}/assignments/my-assignments`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchAssignments();
  }, []);


  if (redirectToLogin) {
    // If redirectToLogin is true, redirect to login page
    return <Navigate to="/login" />
  }
  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case 'TOWING':
        return <span className="badge text-dark bg-primary">🚗 Towing</span>;
      case 'BATTERY':
        return <span className="badge bg-success text-dark ">🔋 Battery</span>;
      case 'FUEL':
        return <span className="badge bg-warning text-dark ">⛽ Fuel Delivery</span>;
      case 'TIRE':
        return <span className="badge bg-dark text-white text-dark ">🛞 Tire Change</span>;
      case 'LOCK':
        return <span className="badge bg-info text-dark text-dark ">🔓 Lockout</span>;
      case 'MINOR_REPAIR':
        return <span className="badge text-dark bg-purple">🔧 Minor Repair</span>;
      default:
        return <span className="badge bg-secondary text-dark ">Unknown</span>;
    }
  };

  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESERVED':
        return <span className="badge bg-warning text-dark">🟧 Reserved awaiting acceptance</span>;
      case 'ASSIGNED':
        return <span className="badge bg-success">🟩 Accepted, Assigned to you</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">❌ Cancelled</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div>
      <h2>My Assignments</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Assignment ID</th>
            <th>Time started</th>
            <th>Time ended</th>
            <th>Status</th>
            <th>Notes</th>
          
            <th>Service Type</th>
           
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={assignment.id}>
              <td>{index + 1}</td>
              <td><Link to={`/assignments/${assignment.assignmentId}`}>{assignment.assignmentId}</Link></td>
              <td>{new Date(assignment.startTime).toLocaleString()}</td>
              <td>{new Date(assignment.endTime).toLocaleString()}</td>
              <td>{getStatusBadge(assignment.assignStatus)}</td>
              <td>{assignment.assignmentNotes}</td>
              <td>{getServiceTypeBadge(assignment.serviceType)}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentDashBoard;
