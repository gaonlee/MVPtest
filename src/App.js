import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, selectAuth } from './authSlice';
import Home from './components/Home';
import ImageUploadPage from './components/ImageUploadPage';
import ImageListPage from './components/ImageListPage';
import ImageDetailPage from './components/ImageDetailPage'; // 추가
import Profile from './components/ProfilePage'; // Profile 컴포넌트 추가
import Login from './components/Login';
import Register from './components/Register';
import AdminPage from './components/AdminPage';
import { Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { token, isAdmin } = useSelector(selectAuth);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
  
    fetchUserProfile();
  }, [token]);
  

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
          <Route path="/profile" element={token ? <Profile user={user} /> : <Navigate to="/login" />} /> {/* Profile 라우트 추가 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
