import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/ProfilePage.css';

function Profile({ user }) {
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <Card className="profile-card">
          <Card.Body>
            <Card.Title>내 정보</Card.Title>
            <Card.Text>
              <strong>아이디:</strong> {user.username}
            </Card.Text>
            <Card.Text>
              <strong>가입날짜:</strong> {new Date(user.joinedDate).toLocaleDateString()}
            </Card.Text>
            <Button variant="primary" onClick={() => navigate('/')}>뒤로가기</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Profile;
