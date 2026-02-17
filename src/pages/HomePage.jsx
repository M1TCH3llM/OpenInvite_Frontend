import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Container className="mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          Welcome, {user?.displayName}! 👋
        </h1>
        <p className="lead text-muted">
          Share events with friends and never miss out
        </p>
      </div>

      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="display-1 mb-3">📅</div>
              <Card.Title className="fw-bold">Create Events</Card.Title>
              <Card.Text className="text-muted">
                Share your plans and invite your friends to join
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="display-1 mb-3">👥</div>
              <Card.Title className="fw-bold">Follow Friends</Card.Title>
              <Card.Text className="text-muted">
                See what events your friends are planning
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="display-1 mb-3">✅</div>
              <Card.Title className="fw-bold">RSVP</Card.Title>
              <Card.Text className="text-muted">
                Let friends know if you're coming to their events
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5">
        <Button as={Link} to="/search" variant="primary" size="lg" className="me-3">
          Find Friends
        </Button>
        <Button as={Link} to="/profile" variant="outline-primary" size="lg">
          View Profile
        </Button>
      </div>

      <Card className="mt-5 bg-light">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">Your Stats</h5>
          <Row>
            <Col xs={6} className="text-center">
              <h3 className="text-primary">{user?.followersCount || 0}</h3>
              <p className="text-muted mb-0">Followers</p>
            </Col>
            <Col xs={6} className="text-center">
              <h3 className="text-primary">{user?.followingCount || 0}</h3>
              <p className="text-muted mb-0">Following</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;