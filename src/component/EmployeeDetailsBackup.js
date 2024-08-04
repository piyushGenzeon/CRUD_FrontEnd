import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployeeDetails.css"; // Ensure this path is correct based on your file structure

const EmployeeDetails = () => {
  const { empId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `https://free-centralindia.cosmocloud.io/development/api/employees/${empId}`,
          {
            headers: {
              projectId: "66ab8ee119a20f84588a19bd",
              environmentId: "66ab8ee119a20f84588a19be",
            },
          }
        );
        setEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [empId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>No employee data found.</div>;

  return (
    <div>
      <h1>Employee Details</h1>
      <table className="employee-details-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{employee.name}</td>
          </tr>
          <tr>
            <th>ID</th>
            <td>{employee.emp_id}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>
              {employee.address_line}, {employee.city}, {employee.country},{" "}
              {employee.zip_code}
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{employee.contacts.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{employee.contacts.phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetails;
