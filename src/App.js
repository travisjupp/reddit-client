import React from 'react';
import './App.css';
import Header from './features/Header/Header.js';
import Sidebar from './features/Sidebar/Sidebar.js';
import Post from './features/Post/Post.js';
import BSScreenSize from './utils/BSScreenSize/BSScreenSize.js';
import { Container, Row, Col } from 'react-bootstrap';

function App() {

  return (
    <>
      <BSScreenSize />
      <Container fluid className='justify-content-start'>
        <Row>
          <Header />
        </Row>
        <Row>
          <Col xs={3} className='d-none d-sm-block' style={{ border: "solid 1px red" }}>
            <Sidebar />
          </Col>
          <Col>
            <Post />
            <Post />
            <Post />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
