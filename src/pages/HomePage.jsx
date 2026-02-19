import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Container className="mt-5">
      <div className="text-center mb-5 hero-section fade-in">
        <h1 className="display-4 fw-bold">
          Welcome, {user?.displayName}! 
          <i className="bi bi-hand-wave ms-3" style={{ color: '#ffc107' }}></i>
        </h1>
        <p className="lead text-muted">
          Share events with friends and never miss out
        </p>
      </div>

      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card 
            className="h-100 shadow-sm text-center hover-lift" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => window.location.href = '/events/create'}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body className="p-4">
              <i className="bi bi-calendar-plus icon-large mb-3"></i>
              <Card.Title className="fw-bold">Create Events</Card.Title>
              <Card.Text className="text-muted">
                Share your plans and invite your friends to join
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="h-100 shadow-sm text-center hover-lift"
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => window.location.href = '/search'}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body className="p-4">
              <i className="bi bi-people icon-large mb-3"></i>
              <Card.Title className="fw-bold">Follow Friends</Card.Title>
              <Card.Text className="text-muted">
                See what events your friends are planning
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card 
            className="h-100 shadow-sm text-center hover-lift"
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => window.location.href = '/events'}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Card.Body className="p-4">
              <i className="bi bi-check-circle icon-large mb-3"></i>
              <Card.Title className="fw-bold">RSVP</Card.Title>
              <Card.Text className="text-muted">
                Let friends know if you're coming to their events
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5">
        <Button as={Link} to="/events" variant="primary" size="lg" className="me-3">
          <i className="bi bi-calendar-event me-2"></i>
          View Events
        </Button>
        <Button as={Link} to="/search" variant="outline-primary" size="lg">
          <i className="bi bi-search me-2"></i>
          Find Friends
        </Button>
      </div>

      <Card className="mt-5">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-graph-up me-2"></i>
            Your Stats
          </h5>
          <Row>
            <Col xs={6} className="text-center">
              <h3 className="text-primary">{user?.followersCount || 0}</h3>
              <p className="text-muted mb-0">
                <i className="bi bi-person-check me-1"></i>
                Followers
              </p>
            </Col>
            <Col xs={6} className="text-center">
              <h3 className="text-primary">{user?.followingCount || 0}</h3>
              <p className="text-muted mb-0">
                <i className="bi bi-person-plus me-1"></i>
                Following
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomePage;