import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import ImageUpload from './ImageUpload';
import '../styles/Button.css';
import '../styles/ImageUploadPage.css';

function ImageUploadPage({ authToken }) {
  const addImage = (imageData) => {
    // 이미지 데이터를 처리하는 로직을 추가하세요.
    console.log("이미지가 추가되었습니다:", imageData);
  };

  const handleLogout = () => {
    // 로그아웃 로직을 추가하세요.
    console.log("로그아웃 되었습니다.");
  };

  return (
    <>
      <Header />
      <Container className="my-5 content">
        <Row>
          <Col>
            <h2 className="text-center">이미지 업로드</h2>
            <p>동물병원 세부내역 영수증, 직접 작성한 메모 등<br />
                동물병원에 방문한 내역이 담긴 자료의 이미지를 업로드 해주세요!<br />
                하루 안으로 진료이력을 생성해드립니다.
            </p>
            <ImageUpload authToken={authToken} addImage={addImage} handleLogout={handleLogout} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ImageUploadPage;
