import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, selectAuth } from './authSlice';
import Home from './components/Home';
import ImageUploadPage from './components/ImageUploadPage';
import ImageListPage from './components/ImageListPage';
import ImageDetailPage from './components/ImageDetailPage'; // 추가
import Login from './components/Login';
import Register from './components/Register';
import AdminPage from './components/AdminPage';
import { Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { token, isAdmin } = useSelector(selectAuth);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch(logout());
        } else {
          dispatch(login({ token, isAdmin }));
        }
      } catch (error) {
        console.error('Invalid token', error);
        dispatch(logout());
      }
    }
  }, [dispatch, token, isAdmin]);

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home authToken={token} onLogout={() => dispatch(logout())} isAdmin={isAdmin} />} />
          <Route path="/login" element={<Login setAuthToken={(token, isAdmin) => dispatch(login({ token, isAdmin }))} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={token ? <ImageUploadPage authToken={token} /> : <Navigate to="/login" />} />
          <Route path="/list" element={token ? <ImageListPage authToken={token} /> : <Navigate to="/login" />} />
          <Route path="/images/:imageId" element={token ? <ImageDetailPage authToken={token} /> : <Navigate to="/login" />} /> {/* 추가 */}
          <Route path="/admin" element={isAdmin ? <AdminPage authToken={token} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
