import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';

const EventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const [myEventsData, feedData] = await Promise.all([
        eventService.getMyEvents(),
        eventService.getFeed()
      ]);
      setMyEvents(myEventsData);
      setFeed(feedData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRSVP = async (eventId, status) => {
    try {
      await eventService.rsvpToEvent(eventId, status);
      loadEvents(); // Reload to update counts
    } catch (error) {
      console.error('RSVP failed:', error);
    }
  };

  const EventCard = ({ event, showCreator = false }) => (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1">{event.title}</Card.Title>
            {showCreator && (
              <small className="text-muted">by @{event.creatorUsername}</small>
            )}
          </div>
          {event.currentUserRSVP && (
            <Badge bg="success">{event.currentUserRSVP}</Badge>
          )}
        </div>

        {event.description && (
          <Card.Text className="text-muted">{event.description}</Card.Text>
        )}

     <div className="mb-3">
        <div className="d-flex align-items-center mb-1">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            <small>{formatDateTime(event.startDateTime)}</small>
        </div>
        {event.location && (
            <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
            <small>{event.location}</small>
            </div>
        )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-2">
            <Badge bg="success">
            <i className="bi bi-check-circle-fill me-1"></i>
            {event.goingCount} Going
            </Badge>
            <Badge bg="warning">
            <i className="bi bi-question-circle-fill me-1"></i>
            {event.maybeCount} Maybe
            </Badge>
        </div>
          {showCreator ? (
            <div className="btn-group">
              <Button
                variant={event.currentUserRSVP === 'GOING' ? 'success' : 'outline-success'}
                size="sm"
                onClick={() => handleRSVP(event.id, 'GOING')}
              >
                Going
              </Button>
              <Button
                variant={event.currentUserRSVP === 'MAYBE' ? 'warning' : 'outline-warning'}
                size="sm"
                onClick={() => handleRSVP(event.id, 'MAYBE')}
              >
                Maybe
              </Button>
              <Button
                variant={event.currentUserRSVP === 'NOT_GOING' ? 'danger' : 'outline-danger'}
                size="sm"
                onClick={() => handleRSVP(event.id, 'NOT_GOING')}
              >
                Can't Go
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              View Details
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Events</h2>
        <Button variant="primary" onClick={() => navigate('/events/create')}>
          + Create Event
        </Button>
      </div>

      <Tabs defaultActiveKey="feed" className="mb-4">
        <Tab eventKey="feed" title={`Feed (${feed.length})`}>
          {feed.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <p className="fs-5">No events from friends yet</p>
              <p>Follow some friends to see their events here!</p>
            </div>
          ) : (
            <Row>
              <Col>
                {feed.map(event => (
                  <EventCard key={event.id} event={event} showCreator={true} />
                ))}
              </Col>
            </Row>
          )}
        </Tab>

        <Tab eventKey="my-events" title={`My Events (${myEvents.length})`}>
          {myEvents.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <p className="fs-5">You haven't created any events yet</p>
              <Button variant="primary" onClick={() => navigate('/events/create')}>
                Create Your First Event
              </Button>
            </div>
          ) : (
            <Row>
              <Col>
                {myEvents.map(event => (
                  <EventCard key={event.id} event={event} showCreator={false} />
                ))}
              </Col>
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EventsPage;