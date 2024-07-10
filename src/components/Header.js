// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Header.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Button onClick={toggleMenu} className="menu-button">
          메뉴
        </Button>
        {showMenu && (
          <div className="menu-dropdown">
            <Link to="/upload" onClick={() => setShowMenu(false)}>이미지 업로드</Link>
            <Link to="/list" onClick={() => setShowMenu(false)}>이미지 조회</Link>
            <Link to="/admin" onClick={() => setShowMenu(false)}>관리자 페이지</Link>
          </div>
        )}
      </div>
      <div className="header-center">
        <Link to="/" className="home-link">
          <img src="https://via.placeholder.com/30" alt="Home" />
        </Link>
      </div>
      <div className="header-right">
        <Link to="/profile" className="profile-link">
          <Button variant="primary">Profile</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
