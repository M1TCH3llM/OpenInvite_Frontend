import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import useAuthStore from '../store/authStore';
import userService from '../services/userService';

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">My Profile</h2>
                {!isEditing && (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {message.text && (
                <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                  {message.text}
                </Alert>
              )}

              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Display Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <div className="mb-4">
                    <h6 className="text-muted">Username</h6>
                    <p className="fs-5">@{user?.username}</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted">Email</h6>
                    <p className="fs-5">{user?.email}</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted">Display Name</h6>
                    <p className="fs-5">{user?.displayName}</p>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-muted">Bio</h6>
                    <p className="fs-5">{user?.bio || 'No bio yet'}</p>
                  </div>

                  <Card className="bg-light border-0">
                    <Card.Body>
                      <Row className="text-center">
                        <Col xs={6}>
                          <h3 className="text-primary mb-0">{user?.followersCount || 0}</h3>
                          <p className="text-muted mb-0">Followers</p>
                        </Col>
                        <Col xs={6}>
                          <h3 className="text-primary mb-0">{user?.followingCount || 0}</h3>
                          <p className="text-muted mb-0">Following</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;