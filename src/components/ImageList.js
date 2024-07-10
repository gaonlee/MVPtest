// ImageList.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, Row, Col, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Button.css';

function ImageList({ authToken }) {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/images', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }, [authToken]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/search', {
        params: { q: searchQuery },
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setImages(response.data);
    } catch (error) {
      console.error('Error searching images:', error);
    }
  };

  const handleImageClick = (image) => {
    navigate(`/images/${image._id}`);
  };

  return (
    <div>
      <Form onSubmit={handleSearch} className="mb-4">
        <FormControl
          type="text"
          placeholder="Search images"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" className="mt-2">Search</Button>
      </Form>
      <Row>
        {images && images.length > 0 ? images.map((image, index) => (
          <Col sm={12} md={6} lg={4} key={index} className="mb-4">
            <Card onClick={() => handleImageClick(image)} style={{ cursor: 'pointer' }}>
              <Card.Img variant="top" src={`http://localhost:5000/uploads/${image.filename}`} />
              <Card.Body>
                <Card.Title>{image.title}</Card.Title>
                <Card.Text>{image.interpretation}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )) : (
          <p>No images found</p>
        )}
      </Row>
    </div>
  );
}

export default ImageList;
