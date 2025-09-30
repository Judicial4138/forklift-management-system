import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTruck, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">
            フォークリフト配車アプリ
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <FaTruck className="me-1" /> 配車状況
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reservations">
              <Nav.Link>
                <FaCalendarAlt className="me-1" /> 予約管理
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reports">
              <Nav.Link>
                <FaFileAlt className="me-1" /> 作業計画書
              </Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <Navbar.Text className="text-light">
              最終更新: {new Date().toLocaleString('ja-JP')}
            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
