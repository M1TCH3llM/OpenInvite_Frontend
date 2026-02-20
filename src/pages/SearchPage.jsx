import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import userService from '../services/userService';
import useAuthStore from '../store/authStore';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);

  // Load all users on component mount
  useEffect(() => {
    loadAllUsers();
  }, []);

  // Filter users whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [query, allUsers]);

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      // Call backend endpoint to get all users
      const users = await userService.getAllUsers();
      // Filter out current user
      const filteredUsers = users.filter(u => u.id !== currentUser.id);
      setAllUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userService.followUser(userId);
      // Update local state
      const updateUsers = (users) => users.map(user => 
        user.id === userId ? { ...user, isFollowing: true, followersCount: user.followersCount + 1 } : user
      );
      setAllUsers(updateUsers);
      setFilteredUsers(updateUsers);
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      const updateUsers = (users) => users.map(user => 
        user.id === userId ? { ...user, isFollowing: false, followersCount: user.followersCount - 1 } : user
      );
      setAllUsers(updateUsers);
      setFilteredUsers(updateUsers);
    } catch (error) {
      console.error('Unfollow failed:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">
        <i className="bi bi-people me-2"></i>
        Find Friends
      </h2>

      <Form className="mb-4">
        <InputGroup size="lg">
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by username or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <InputGroup.Text 
              role="button" 
              onClick={() => setQuery('')}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-x-circle"></i>
            </InputGroup.Text>
          )}
        </InputGroup>
      </Form>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading users...</p>
        </div>
      ) : (
        <>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <i className="bi bi-person-x icon-large mb-3"></i>
              <p className="fs-5">
                {query ? `No users found matching "${query}"` : 'No users available'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted mb-3">
                Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                {query && ` matching "${query}"`}
              </p>
              <Row className="g-3">
                {filteredUsers.map((user) => (
                  <Col key={user.id} md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-1">{user.displayName}</h5>
                            <p className="text-muted mb-0">@{user.username}</p>
                          </div>
                          {user.isFollowing ? (
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleUnfollow(user.id)}
                            >
                              <i className="bi bi-person-dash me-1"></i>
                              Unfollow
                            </button>
                          ) : (
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => handleFollow(user.id)}
                            >
                              <i className="bi bi-person-plus me-1"></i>
                              Follow
                            </button>
                          )}
                        </div>

                        {user.bio && (
                          <p className="text-muted small mb-3">{user.bio}</p>
                        )}

                        <div className="d-flex gap-3">
                          <Badge bg="success">
                            <i className="bi bi-people-fill me-1"></i>
                            {user.followersCount} followers
                          </Badge>
                          <Badge bg="info">
                            <i className="bi bi-person-check-fill me-1"></i>
                            {user.followingCount} following
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;