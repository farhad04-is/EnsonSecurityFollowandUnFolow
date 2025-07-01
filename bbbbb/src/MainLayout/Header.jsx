import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">EngLang</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
             <Nav.Link as={Link} to="/youtubevideoURL">youtube_URL</Nav.Link>
            <Nav.Link as={Link} to="/AllWords">AllWords</Nav.Link>
            <Nav.Link as={Link} to="/messages">Message</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/searchFriends">searchFriends</Nav.Link>
            <Nav.Link as={Link} to="/videolists">VideoLists</Nav.Link>
            <Nav.Link as={Link} to="/playlists">PlayLists</Nav.Link>
            <Nav.Link as={Link} to="/signUp">signUp</Nav.Link>
            <Nav.Link as={Link} to="/login">login</Nav.Link>

 
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
