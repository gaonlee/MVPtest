import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import ImageUpload from './ImageUpload';
import '../styles/Button.css';
import '../styles/ImageUploadPage.css';

function ImageUploadPage({ addImage, authToken }) {
  return (
    <>
      <Header />
      <Container className="content my-5">
        <Row>
          <Col>
            <h2 className="text-center">이미지 업로드</h2>
            <ImageUpload addImage={addImage} authToken={authToken} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ImageUploadPage;
