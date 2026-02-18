import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import useAuthStore from '../store/authStore';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    setLoading(true);
    try {
      const [eventData, rsvpData] = await Promise.all([
        eventService.getEvent(id),
        eventService.getEventRSVPs(id)
      ]);
      setEvent(eventData);
      setRsvps(rsvpData);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    try {
      await eventService.rsvpToEvent(id, status);
      loadEventDetails(); // Reload to update
    } catch (err) {
      console.error('RSVP failed:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        navigate('/events');
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttendeesByStatus = (status) => {
    return rsvps.filter(rsvp => rsvp.status === status);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Event not found'}</Alert>
        <Button variant="primary" onClick={() => navigate('/events')}>
          Back to Events
        </Button>
      </Container>
    );
  }

  const isCreator = event.createdById === currentUser.id;
  const goingList = getAttendeesByStatus('GOING');
  const maybeList = getAttendeesByStatus('MAYBE');

  return (
    <Container className="mt-4">
      <Button variant="link" onClick={() => navigate('/events')} className="mb-3 ps-0">
        ← Back to Events
      </Button>

      <Row>
        <Col lg={8}>
          <Card className="shadow mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="mb-2">{event.title}</h2>
                  <p className="text-muted mb-0">
                    Created by <strong>{event.creatorName}</strong> (@{event.creatorUsername})
                  </p>
                </div>
                {event.currentUserRSVP && (
                  <Badge bg="success" className="fs-6">{event.currentUserRSVP}</Badge>
                )}
              </div>

              {event.description && (
                <p className="mb-4">{event.description}</p>
              )}

              <div className="mb-4">
                <div className="d-flex align-items-start mb-2">
                  <span className="me-2 fs-5">📅</span>
                  <div>
                    <strong>Starts:</strong> {formatDateTime(event.startDateTime)}
                    {event.endDateTime && (
                      <div><strong>Ends:</strong> {formatDateTime(event.endDateTime)}</div>
                    )}
                  </div>
                </div>
                {event.location && (
                  <div className="d-flex align-items-center">
                    <span className="me-2 fs-5">📍</span>
                    <strong>{event.location}</strong>
                  </div>
                )}
              </div>

              {!isCreator && (
                <div className="d-flex gap-2">
                  <Button
                    variant={event.currentUserRSVP === 'GOING' ? 'success' : 'outline-success'}
                    onClick={() => handleRSVP('GOING')}
                  >
                    ✅ Going
                  </Button>
                  <Button
                    variant={event.currentUserRSVP === 'MAYBE' ? 'warning' : 'outline-warning'}
                    onClick={() => handleRSVP('MAYBE')}
                  >
                    🤔 Maybe
                  </Button>
                  <Button
                    variant={event.currentUserRSVP === 'NOT_GOING' ? 'danger' : 'outline-danger'}
                    onClick={() => handleRSVP('NOT_GOING')}
                  >
                    ❌ Can't Go
                  </Button>
                </div>
              )}

              {isCreator && (
                <div className="d-flex gap-2 mt-3">
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Event
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow mb-3">
            <Card.Body>
              <h5 className="mb-3">Attendance</h5>
              <div className="d-flex justify-content-around text-center">
                <div>
                  <h3 className="text-success mb-0">{event.goingCount}</h3>
                  <small className="text-muted">Going</small>
                </div>
                <div>
                  <h3 className="text-warning mb-0">{event.maybeCount}</h3>
                  <small className="text-muted">Maybe</small>
                </div>
                <div>
                  <h3 className="text-danger mb-0">{event.notGoingCount}</h3>
                  <small className="text-muted">Can't Go</small>
                </div>
              </div>
            </Card.Body>
          </Card>

          {goingList.length > 0 && (
            <Card className="shadow mb-3">
              <Card.Body>
                <h6 className="mb-3">Going ({goingList.length})</h6>
                <ListGroup variant="flush">
                  {goingList.map(rsvp => (
                    <ListGroup.Item key={rsvp.id} className="px-0">
                      <strong>{rsvp.displayName}</strong>
                      <br />
                      <small className="text-muted">@{rsvp.username}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {maybeList.length > 0 && (
            <Card className="shadow">
              <Card.Body>
                <h6 className="mb-3">Maybe ({maybeList.length})</h6>
                <ListGroup variant="flush">
                  {maybeList.map(rsvp => (
                    <ListGroup.Item key={rsvp.id} className="px-0">
                      <strong>{rsvp.displayName}</strong>
                      <br />
                      <small className="text-muted">@{rsvp.username}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailsPage;