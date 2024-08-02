import React from 'react';
import './App.css';
import Header from './features/Header/Header.jsx';
import Sidebar from './features/Sidebar/Sidebar.jsx';

import Main from './features/Main/Main.jsx';
import BSScreenSize from './utils/BSScreenSize/BSScreenSize.js';
import {Container, Row, Col} from 'react-bootstrap';

function App() {

  return (
    <>
      <BSScreenSize />
      <Container fluid className='justify-content-start'>
        {/* HEADER */}
        <Row as='header' style={{position: "sticky", top: 0, zIndex: 4}}>
          <Header />
        </Row>
        <Row>
          {/* SIDEBAR show on md and larger */}
          <Col as='aside' md={3} className='d-none d-md-block position-sticky overflow-y-auto p-0 top-0'
            style={{height: "100vh"}}>
            <Sidebar />
          </Col>
          {/* MAIN */}
          <Col as='main'>
            <Main />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
