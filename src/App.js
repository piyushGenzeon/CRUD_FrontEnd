import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeesList from "./component/EmployeesList";
import EmployeeDetails from "./component/EmployeeDetails";
// Adjust the path as necessary

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<EmployeesList />} exact />
          <Route path="/employeedetails/:empId" element={<EmployeeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
