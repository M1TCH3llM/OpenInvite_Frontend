import api from './api';

const eventService = {
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get('/events/my-events');
    return response.data;
  },

  getFeed: async () => {
    const response = await api.get('/events/feed');
    return response.data;
  },

  getEventsInRange: async (start, end) => {
    const response = await api.get('/events/calendar', {
      params: { start, end }
    });
    return response.data;
  },

  rsvpToEvent: async (eventId, status) => {
    const response = await api.post(`/events/${eventId}/rsvp`, { status });
    return response.data;
  },

  getEventRSVPs: async (eventId) => {
    const response = await api.get(`/events/${eventId}/rsvp`);
    return response.data;
  },

  getMyRSVPs: async () => {
    const response = await api.get('/events/my-rsvps');
    return response.data;
  },
};

export default eventService;