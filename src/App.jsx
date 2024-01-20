import React from 'react';
import './App.css';
import Header from './features/Header/Header.jsx';
import Sidebar from './features/Sidebar/Sidebar.jsx';

import Main from './features/Main/Main.jsx';
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
            <Main />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
