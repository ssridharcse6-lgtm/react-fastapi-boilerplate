import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { loginUser, registerUser } from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Signup States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !/^\S+@\S+\.\S+$/.test(regEmail) || regPassword.length < 6) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    try {
      await registerUser({ username: fullName, email: regEmail, password: regPassword });
      setShowRegister(false);
      alert('Registration successful! You can now login.');
    } catch (err) {
      alert('Error while registering. Try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={5} lg={4}>
          <Card className="p-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
            <h3 className="text-center mb-4">Login</h3>

            {error && <p className="text-danger text-center">{error}</p>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formUserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-2"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold">
                Login
              </Button>
            </Form>

            <p className="text-center mt-3">
              Don’t have an account?{' '}
              <span
                className="text-primary"
                role="button"
                onClick={() => setShowRegister(true)}
              >
                Sign Up
              </span>
            </p>
          </Card>
        </Col>
      </Row>

      {/* Signup Modal */}
      <Modal show={showRegister} onHide={() => setShowRegister(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>
                First Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isInvalid={!firstName}
              />
              <Form.Control.Feedback type="invalid">
                First name is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>
                Last Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={!lastName}
              />
              <Form.Control.Feedback type="invalid">
                Last name is required
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                isInvalid={!/^\S+@\S+\.\S+$/.test(regEmail)}
              />
              <Form.Control.Feedback type="invalid">
                Enter a valid email address
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                isInvalid={regPassword.length < 6}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 6 characters
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegister(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleRegister}
            disabled={!firstName || !lastName || !/^\S+@\S+\.\S+$/.test(regEmail) || regPassword.length < 6}
          >
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
