import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
function Header() {
  
  return (
    
   <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">EngLang</Navbar.Brand>
          <Nav className="me-auto">
<Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link href="AllWords">AllWords</Nav.Link>
            <Nav.Link href="messages">Message</Nav.Link>
              <Nav.Link href="profile">Profile</Nav.Link>
            <Nav.Link href="searchFriends">searchFriends</Nav.Link>
              <Nav.Link href="VideoLists">VideoLists</Nav.Link>
            <Nav.Link href="playlists">PlayLists</Nav.Link>
             <Nav.Link href="signUp">signUp</Nav.Link>
              <Nav.Link href="login">login</Nav.Link>
          </Nav>
        </Container>
      </Navbar> 
   </>
  )
}

export default Header