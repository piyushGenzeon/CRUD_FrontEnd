import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation
import { Button } from "@mui/material"; // Import Button from Material-UI
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import back arrow icon from MUI
import "./EmployeeDetails.css"; // Ensure this path is correct based on your file structure

const EmployeeDetails = () => {
  const { empId } = useParams();
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address_line: "",
    city: "",
    country: "",
    zip_code: "",
    contacts: {
      email: "",
      phone: "",
    },
  });
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
        setFormData(response.data); // Initialize form data with employee details
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [empId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("contacts.")) {
      const contactField = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        contacts: {
          ...prevFormData.contacts,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async () => {
    // Perform basic validation
    if (!/^\d{10}$/.test(formData.contacts.phone)) {
      alert("Phone number must be a 10-digit number.");
      return;
    }
    if (!/@/.test(formData.contacts.email)) {
      alert("Email must contain an @ symbol.");
      return;
    }

    try {
      await axios.patch(
        `https://free-centralindia.cosmocloud.io/development/api/employees/${empId}`,
        {
          name: formData.name,
          address_line: formData.address_line,
          city: formData.city,
          country: formData.country,
          zip_code: formData.zip_code,
          contacts: {
            email: formData.contacts.email,
            phone: formData.contacts.phone,
          },
        },
        {
          headers: {
            projectId: "66ab8ee119a20f84588a19bd",
            environmentId: "66ab8ee119a20f84588a19be",
            "Content-Type": "application/json",
          },
        }
      );
      setEditMode(false); // Exit edit mode on successful update
      setEmployee(formData); // Update local state with new data
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://free-centralindia.cosmocloud.io/development/api/employees/${empId}`,
        {
          headers: {
            projectId: "66ab8ee119a20f84588a19bd",
            environmentId: "66ab8ee119a20f84588a19be",
            "Content-Type": "application/json",
          },
          data: {}, // Optional: Include empty data object if required by API
        }
      );
      navigate("/"); // Redirect to EmployeesList page after deletion
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>No employee data found.</div>;

  return (
    <div>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="primary"
          style={{ marginBottom: "10px" }}
        >
          Back to Employees List
        </Button>
      </Link>
      <h1>Employee Details</h1>
      <table className="employee-details-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                employee.name
              )}
            </td>
          </tr>
          <tr>
            <th>ID</th>
            <td>{employee.emp_id}</td>
          </tr>
          <tr>
            <th>Address Line</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                />
              ) : (
                employee.address_line
              )}
            </td>
          </tr>
          <tr>
            <th>City</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              ) : (
                employee.city
              )}
            </td>
          </tr>
          <tr>
            <th>Country</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              ) : (
                employee.country
              )}
            </td>
          </tr>
          <tr>
            <th>Zip Code</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                />
              ) : (
                employee.zip_code
              )}
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>
              {editMode ? (
                <input
                  type="email"
                  name="contacts.email"
                  value={formData.contacts.email}
                  onChange={handleInputChange}
                />
              ) : (
                employee.contacts.email
              )}
            </td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>
              {editMode ? (
                <input
                  type="text"
                  name="contacts.phone"
                  value={formData.contacts.phone}
                  onChange={handleInputChange}
                />
              ) : (
                employee.contacts.phone
              )}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "center", paddingTop: "20px" }}>
              {editMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                  style={{ marginRight: "10px" }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetails;
