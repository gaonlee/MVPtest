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
            <h1 className="title">촉촉한코</h1>
            <p>
              안녕하세요! 동물병원 진료이력 저장소입니다. <br /><br />
              동물병원 세부내역 영수증, 직접 작성하신 메모 등 <br />
              동물병원 방문과 관련된 자료를 업로드해주세요! <br />
              자료를 기반으로 진료이력을 생성해줍니다!
            </p>
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
