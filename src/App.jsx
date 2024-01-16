import React from 'react';
import './App.css';
import Header from './features/Header/Header.jsx';
import Sidebar from './features/Sidebar/Sidebar.jsx';
import Post from './features/Post/Post.jsx';
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
          <Col xs={3} className='d-none d-md-block' style={{ border: "solid 1px red" }}>
            <Sidebar />
          </Col>
          <Col>
          {/* MAP POSTS ARRAY FOR SELECTED SUBREDDIT TO RENDER POST COMPONENTS */}
          {/* HANDLE THIS SECTION WITH NEW MAIN.JSX COMPONENT THAT RENDERS POSTS */}
            <Post postTitle={'Map Partition'} postImgSrc={'https://i.redd.it/dcjc97hi3mcc1.jpeg'} />
            <Post />
            <Post />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
