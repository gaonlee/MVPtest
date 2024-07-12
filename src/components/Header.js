import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import './Header.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Button onClick={toggleMenu} className="menu-button custom-button">
          메뉴
        </Button>
        {showMenu && (
          <Dropdown.Menu show className="custom-dropdown-menu">
            <Dropdown.Item as={Link} to="/upload" onClick={() => setShowMenu(false)}>이미지 업로드</Dropdown.Item>
            <Dropdown.Item as={Link} to="/list" onClick={() => setShowMenu(false)}>이미지 조회</Dropdown.Item>
           
          </Dropdown.Menu>
        )}
      </div>
      <div className="header-center">
        <Link to="/" className="home-link">
          <img src="/Home_logo.png" alt="Home" className="header-logo" />
        </Link>
        <div className="header-text">촉촉한코</div>
      </div>
      <div className="header-right">
        <Link to="/profile" className="profile-link">
          <Button variant="primary">내 정보</Button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
