import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  DialogContentText,
} from "@mui/material";
import "./EmployeesList.css";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openNoEmployees, setOpenNoEmployees] = useState(false);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://free-centralindia.cosmocloud.io/development/api/employees?limit=10&offset=0",
          {
            headers: {
              projectId: "66ab8ee119a20f84588a19bd",
              environmentId: "66ab8ee119a20f84588a19be",
            },
          }
        );
        if (response.data.data.length === 0) {
          setOpenNoEmployees(true);
        } else {
          setEmployees(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNoEmployees = () => {
    setOpenNoEmployees(false);
    handleOpen(); // Opens the add employee dialog
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("contacts.")) {
      const contactField = name.split(".")[1];
      setFormData({
        ...formData,
        contacts: {
          ...formData.contacts,
          [contactField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    // Find the max emp_id from the employees list and increment by 1
    const maxEmpId = employees.reduce(
      (maxId, employee) => Math.max(maxId, employee.emp_id),
      0
    );

    try {
      await axios.post(
        "https://free-centralindia.cosmocloud.io/development/api/employees",
        {
          ...formData,
          emp_id: maxEmpId + 1, // Assign a new unique emp_id
        },
        {
          headers: {
            projectId: "66ab8ee119a20f84588a19bd",
            environmentId: "66ab8ee119a20f84588a19be",
            "Content-Type": "application/json",
          },
        }
      );
      handleClose();
      setEmployees([...employees, { ...formData, emp_id: maxEmpId + 1 }]); // Optionally refresh the employee list
    } catch (err) {
      console.error("Error adding employee:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: "60px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
        >
          Employee List
        </h1>

        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: "60px", marginRight: "60px" }}
          onClick={handleOpen}
        >
          Add Employee
        </Button>
      </div>
      {employees.length > 0 ? (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.emp_id}</td>
                <td>
                  <Link
                    to={`/employeedetails/${employee._id}`}
                    className="employee-link"
                  >
                    {employee.name}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Dialog open={openNoEmployees} onClose={handleCloseNoEmployees}>
          <DialogTitle>No Employees Found</DialogTitle>
          <DialogContent>
            <DialogContentText>
              There are currently no employees in the system. Please add new
              employee.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNoEmployees}>OK</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the new employee.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="address_line"
            label="Address Line"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="country"
            label="Country"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="zip_code"
            label="Zip Code"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="contacts.email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="contacts.phone"
            label="Phone"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeesList;
