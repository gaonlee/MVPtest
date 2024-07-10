import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Image, Form, Button, Modal } from 'react-bootstrap';
import Header from './Header';
import '../styles/ImageDetailPage.css';

function ImageDetailPage({ authToken }) {
  const { imageId } = useParams();
  const [image, setImage] = useState(null);
  const [newInterpretation, setNewInterpretation] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/images/${imageId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setImage(response.data);
        setNewInterpretation(response.data.interpretation);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [authToken, imageId]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveInterpretation = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/images/${imageId}`, {
        interpretation: newInterpretation
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setImage(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating interpretation:', error);
    }
  };

  if (!image) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <Container className="my-5 content">
        <Image src={`http://localhost:5000/uploads/${image.filename}`} fluid />
        <h2>{image.title}</h2>
        <p>{image.interpretation}</p>
        <Button variant="secondary" onClick={handleOpenModal}>Edit</Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Interpretation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="interpretation">
                <Form.Label>Interpretation</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newInterpretation}
                  onChange={(e) => setNewInterpretation(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" onClick={handleSaveInterpretation}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default ImageDetailPage;