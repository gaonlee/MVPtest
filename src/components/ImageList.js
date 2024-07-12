import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Button.css';
import '../styles/ImageList.css';

function ImageList({ authToken }) {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get('https://pet-medical-histoy-mvp.vercel.app/', {
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
    <div className="image-list-container">
      <Form onSubmit={handleSearch} className="form-inline search-form">
        <FormControl
          type="text"
          placeholder="Search images"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">검색</Button>
      </Form>
      <div className="image-list">
        {images && images.length > 0 ? images.map((image, index) => (
          <Card key={index} onClick={() => handleImageClick(image)} className="card">
            <Card.Img variant="top" src={`http://localhost:5000/uploads/${image.filename}`} />
            <Card.Body className="card-body">
              <Card.Title className="card-title">{image.title}</Card.Title>
              <Card.Text className="card-text">{image.interpretation}</Card.Text>
            </Card.Body>
          </Card>
        )) : (
          <p>No images found</p>
        )}
      </div>
    </div>
  );
}

export default ImageList;
