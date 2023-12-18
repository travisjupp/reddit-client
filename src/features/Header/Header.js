import React from 'react';
import { NavItem, NavLink, NavbarBrand, Button, Container, Col, Row, Form, Nav, Navbar, NavDropdown, Offcanvas, InputGroup } from 'react-bootstrap';

import { BsSearch } from "react-icons/bs/index.js";

const nbToggle = {
    border: 'none',
}

function Header(props) {
    return (
        <>


            <Container fluid className='justify-content-start'>
                <Row>
                    <Navbar key='md' expand='md' variant='dark' bg='dark' collapseOnSelect>
                        <Col xs={3} className='d-flex' style={{ border: "1px solid red" }}>

                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} style={nbToggle} />
                            <Navbar.Brand>Navbar.Brand</Navbar.Brand>



                            <Nav className="justify-content-start pe-3">
                                <Nav.Link href="#action1">Home</Nav.Link>
                            </Nav>

                        </Col>
                        <Col style={{ border: "1px solid red" }}>

                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-sm`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                                placement="start"
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                        Offcanvas
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <Form className="d-flex flex-grow-1" aria-label='Search' id='searchForm'>
                                    <Form className="d-flex flex-grow-1" aria-label='Search' id='searchForm'>

                                        <InputGroup>
                                            <Form.Control
                                                type="search"
                                                placeholder="placeholder"
                                                className=""
                                                aria-labelledby='searchForm'
                                            />
                                            {/* rendering search button as NavLink for Offcanvas navbar to collapse after clicking (collapseOnSelect) */}
                                            <Button as={NavLink} href="#" variant="secondary" aria-labelledby='searchForm'><BsSearch aria-labelledby='searchForm' /></Button>
                                        </InputGroup>

                                    </Form>

                                    </Form>

                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </Col>

                    </Navbar>
                </Row>
            </Container>
            {/*
            <Navbar key={'sm'} expand={'sm'} variant='dark' bg='dark'>
                <Container fluid='sm' className='justify-content-start'>

                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} style={nbToggle} />
                            <Navbar.Brand>Navbar.Brand</Navbar.Brand>


                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-sm`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                                placement="start"
                            >
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                        Offcanvas
                                    </Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body style={{
                                    border: 'solid 1px red'
                                }}>

                                        <Nav className="justify-content-start pe-3">
                                            <Nav.Link href="#action1">Home</Nav.Link>
                                        </Nav>


                                        <Form className="d-flex flex-grow-1" aria-label='Search' id='searchForm'>
                                            <InputGroup>
                                                <Form.Control
                                                    type="search"
                                                    placeholder="placeholder"
                                                    className=""
                                                    aria-labelledby='searchForm'
                                                />
                                                <Button variant="secondary" aria-labelledby='searchForm'><BsSearch aria-labelledby='searchForm' /></Button>
                                            </InputGroup>
                                        </Form>

                                </Offcanvas.Body>
                            </Navbar.Offcanvas> 


                </Container>
            </Navbar>*/}
        </>
    )
}

export default Header;