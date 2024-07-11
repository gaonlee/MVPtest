import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './Header';
import ImageList from './ImageList';
import '../styles/Button.css';
import '../styles/ImageListPage.css';

function ImageListPage({ authToken, images }) {
  return (
    <>
      <Header />
      <Container className="my-5 content">
        <Row>
          <Col>
            <h2 className="text-center">진료이력 조회</h2>
            <p className="text-center">요약된 진료이력을 조회하세요</p> {/* 설명 추가 */}
            <ImageList authToken={authToken} images={images} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ImageListPage;
