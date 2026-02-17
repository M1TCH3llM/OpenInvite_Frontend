import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import userService from '../services/userService';
import useAuthStore from '../store/authStore';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const users = await userService.searchUsers(query);
      setResults(users.filter(u => u.id !== currentUser.id));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userService.followUser(userId);
      // Update local state
      setResults(results.map(user => 
        user.id === userId ? { ...user, isFollowing: true } : user
      ));
    } catch (error) {
      console.error('Follow failed:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      setResults(results.map(user => 
        user.id === userId ? { ...user, isFollowing: false } : user
      ));
    } catch (error) {
      console.error('Unfollow failed:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Find Friends</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup size="lg">
          <Form.Control
            type="text"
            placeholder="Search by username or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </InputGroup>
      </Form>

      {results.length === 0 && !loading && query && (
        <div className="text-center text-muted mt-5">
          <p className="fs-5">No users found</p>
        </div>
      )}

      <Row className="g-3">
        {results.map((user) => (
          <Col key={user.id} md={6} lg={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">{user.displayName}</h5>
                    <p className="text-muted mb-0">@{user.username}</p>
                  </div>
                  {user.isFollowing ? (
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                    >
                      Follow
                    </Button>
                  )}
                </div>

                {user.bio && (
                  <p className="text-muted small mb-3">{user.bio}</p>
                )}

                <div className="d-flex gap-3">
                  <Badge bg="light" text="dark">
                    {user.followersCount} followers
                  </Badge>
                  <Badge bg="light" text="dark">
                    {user.followingCount} following
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchPage;