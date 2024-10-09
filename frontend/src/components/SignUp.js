import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_API_URL || "https://alolprojectspace.com";

const logingStyle = { 
  position: "absolute", 
  top: "calc(25%)", 
  left : "calc(40%)"
};


const signUpUser = async (credentials) => {
  try {
    const result = await axios.post(`${API_URL}/signup`, credentials);
    toast.error(result?.data?.error);
    return result.data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


export default function SignUp({ setIsSignUped }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Password is emty!");
      return;
    }
    if (password !== password2) {
      toast.error("Passwords must be the same!");
      return;
    }
    
    const response = await signUpUser({
      username: username,
      password: password,
    });
    if (response?.inserted_id) {
      toast.warn(`User ${username} was registrated!`);
      setIsSignUped(true);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} style={logingStyle}>
        <h3>Please Sign Up</h3>
        <br />
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={5}>
            Email
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => setUserName(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={5}>
            Password
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword2"
        >
          <Form.Label column sm={8}>
            Password Confirmation
          </Form.Label>
          <Col sm={12}>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Form.Group>
        <br />

        <Form.Group as={Row} className="col-md-12 text-center">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Submit</Button>
          </Col>
        </Form.Group>
      </Form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
