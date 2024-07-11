import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/Button.css';
import './Home.css';

function Home({ authToken, onLogout, isAdmin }) {
  return (
    <>
      <Header />
      <div className="content">
        <Row>
          <Col className="text-center">
            <p>안녕하세요! 진료이력 저장소입니다.</p>
            {authToken ? (
              <>
                <Button variant="primary" as={Link} to="/upload" className="m-2 button">
                  이미지 업로드
                </Button>
                <Button variant="primary" as={Link} to="/list" className="m-2 button">
                  이미지 조회
                </Button>
                {isAdmin && (
                  <Button variant="warning" as={Link} to="/admin" className="m-2 button button-warning">
                    관리자 페이지
                  </Button>
                )}
                <Button variant="danger" onClick={onLogout} className="mx-2 button button-danger">
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" as={Link} to="/login" className="m-2 button">
                  로그인
                </Button>
                <Button variant="primary" as={Link} to="/register" className="m-2 button">
                  회원가입
                </Button>
              </>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
