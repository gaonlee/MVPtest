import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Modal, Image, Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import Header from './Header'; // Header 추가
import '../styles/Button.css';
import '../styles/AdminPage.css'; // 새로운 스타일 파일 추가

function AdminPage({ authToken }) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newInterpretation, setNewInterpretation] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageToShow, setImageToShow] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/images_with_users', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setImages(response.data);
        setFilteredImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/users', {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchImages();
    fetchUsers();
  }, [authToken]);

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setNewTitle(image.title);
    setNewInterpretation(image.interpretation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setNewTitle('');
    setNewInterpretation('');
  };

  const handleSaveInterpretation = async () => {
    if (selectedImage) {
      try {
        const response = await axios.put(`http://localhost:5000/admin/images/${selectedImage._id}`, {
          title: newTitle,
          interpretation: newInterpretation
        }, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const updatedImage = response.data;
        setImages(images.map(image => image._id === updatedImage._id ? updatedImage : image));
        setFilteredImages(filteredImages.map(image => image._id === updatedImage._id ? updatedImage : image));
        handleCloseModal();
      } catch (error) {
        console.error('Error updating interpretation:', error);
      }
    }
  };

  const handleImageClick = (imagePath) => {
    setImageToShow(`http://localhost:5000/uploads/${imagePath}`);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setImageToShow('');
  };

  const filterByUser = (username) => {
    const userImages = images.filter(image => image.username === username);
    setFilteredImages(userImages);
  };

  const showAllImages = () => {
    setFilteredImages(images);
  };

  return (
    <>
      <Header /> {/* Header 추가 */}
      <div className="content">
        <DropdownButton id="dropdown-basic-button" title="Select User" className="mb-3">
          <Dropdown.Item onClick={showAllImages}>Show All Images</Dropdown.Item>
          {users.map(user => (
            <Dropdown.Item key={user._id} onClick={() => filterByUser(user.username)}>
              {user.username}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Row>
          {filteredImages.map((image, index) => (
            <Col sm={12} md={6} lg={4} key={index} className="mb-4">
              <Card className="image-card">
                <Image
                  src={`http://localhost:5000/uploads/${image.filename}`}
                  thumbnail
                  onClick={() => handleImageClick(image.filename)}
                  style={{ cursor: 'pointer' }}
                />
                <Card.Body>
                  <Card.Title>{image.title || "No Title"}</Card.Title>
                  <Card.Text>{image.interpretation}</Card.Text>
                  <Card.Text><strong>Username:</strong> {image.username}</Card.Text>
                  <Button variant="secondary" onClick={() => handleOpenModal(image)}>Edit</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Image Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="interpretation" className="mt-3">
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

        <Modal show={showImageModal} onHide={handleCloseImageModal}>
          <Modal.Header closeButton>
            <Modal.Title>Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image src={imageToShow} fluid />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseImageModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default AdminPage;
