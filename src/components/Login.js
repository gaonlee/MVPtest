import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/Button.css';
import './Login.css';

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post('https://pet-medical-histoy-n0uny5i36-mks-projects-119eb587.vercel.app', { username, password });
      const { access_token, isAdmin } = response.data;
      setAuthToken(access_token, isAdmin);
      localStorage.setItem('token', access_token); // JWT 토큰을 localStorage에 저장
      localStorage.setItem('isAdmin', isAdmin); // 관리자 여부를 localStorage에 저장
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <Header />
      <Container className="my-5 content">
        <Row>
          <Col>
            <h2 className="text-center">로그인</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3 form-group">
                <Form.Label className="form-label">아이디</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="custom-input"
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3 form-group">
                <Form.Label className="form-label">비밀번호</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input"
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button variant="primary" type="submit" className="w-100 button">
                로그인
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
