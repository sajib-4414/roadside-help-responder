import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, Navigate } from 'react-router-dom';

const AssignmentDetails = () => {
  const { id: assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setRedirectToLogin(true);
          return;
        }

        const assignmentRes= await axios.get(`${process.env.REACT_APP_RESPONDER_API_HOST}/assignments/assignment-by-id/${assignmentId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          
        setAssignment(assignmentRes.data);
        // setBookignId(assignmentRes.data.bookingId)
        fetchBookingDetails(assignmentRes.data.bookingId)
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId]);


    const fetchBookingDetails = async (bookingId) => {
        console.log("booking id is",bookingId)
        if (!bookingId)
            return;
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setRedirectToLogin(true);
          return;
        }

        const bookingRes = await axios.get(`${process.env.REACT_APP_USER_API_HOST}/bookings/booking-id/${bookingId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        
        setBooking(bookingRes.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };


  const handleAccept = async () => {
    setAccepting(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_RESPONDER_API_HOST}/assignments/accept-request/${assignment.assignmentId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      //introducing delay
      await new Promise((resolve)=> setTimeout(resolve,2500))
      // Refresh the assignment details
      const response = await axios.get(`${process.env.REACT_APP_RESPONDER_API_HOST}/assignments/assignment-by-id/${assignment.assignmentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      setAssignment(response.data);
    } catch (error) {
      console.error('Error accepting assignment:', error);
    } finally {
      setAccepting(false);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }



  return (
    <div className="container mt-4">
      <h2>Assignment Details</h2>
      {!booking?
        <div className="text-center my-5">Loading Booking...</div>
        :
        
        <div className="card mb-3">
            <div className="card-body">
            <h5>Booking Details</h5>
            <p><strong>Service Type:</strong> {booking.serviceType}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Priority:</strong> {booking.priority}</p>
            </div>
        </div>
      }


     

      {/* ✅ Assignment Details */}
      {!assignment ?
      <div className="text-center my-5">Loading Assignment...</div>
      :
        <div className="card mb-3">
            <div className="card-body">
            <h5>Assignment Details</h5>
            <p><strong>Assignment ID:</strong> {assignment.assignmentId}</p>
            <p><strong>Start Time:</strong> {new Date(assignment.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {assignment.endTime ? new Date(assignment.endTime).toLocaleString() : 'Not Ended Yet'}</p>
            <p><strong>Status:</strong> {assignment.assignStatus}</p>
            {assignment.assignStatus === 'RESERVED' && (
                <button
                className="btn btn-success"
                disabled={accepting}
                onClick={handleAccept}
                >
                {accepting ? 'Accepting...' : 'Accept Assignment'}
                </button>
            )}
            {assignment.assignStatus === 'ASSIGNED' && (
                <p className='badge bg-success'>Accepted</p>
            )}
            </div>
        </div>
      }
      

      {/* ✅ Assistance Details */}
      <div className="card">
        <div className="card-body">
          <h5>Assistance Details</h5>
          <p>This section will handle further status updates.</p>
        </div>
      </div>

      <div className="mt-4">
        <Link to="/" className="btn btn-secondary">
          ⬅ Back to Assignments
        </Link>
      </div>
    </div>
  );
};

export default AssignmentDetails;
