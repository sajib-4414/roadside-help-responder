import Header from './components/common/header';
import Footer from './components/common/footer';
import {BrowserRouter as Router,  Routes ,Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import BookingDetails from './components/booking/bookingdetails';
import AssignmentDashBoard from './components/assignment-dashboard';
import AssignmentDetails from './components/assignment/assignment-details';
function App() {
  return (
    <div>
  
      <Router>
      <Header/>
      <main role="main" 
      className="container"
      style={{ padding: "20px", marginTop: "100px" }}
      >
        <Routes>
            <Route exact path="" element={<AssignmentDashBoard/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/bookings/:id?" element={<BookingDetails/>} />
            <Route exact path="/assignments/:id?" element={<AssignmentDetails/>} />

           
        </Routes>
        </main>
      </Router>
      
      <Footer/>

    </div>
     
  );
}

export default App;
