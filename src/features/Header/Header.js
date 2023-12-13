import React from 'react';
import { NavItem, NavLink, NavbarBrand } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsSearch } from "react-icons/bs";

const nbToggle = {
    border: 'none',
}

function Header(props) {
    return (
        <>
            <style type='text/css'>
                {`
                {Navbar toggler}
                    .navbar-toggler:focus {
                        box-shadow: none;
                    }

                    {Form control}
                    .form-control:focus {
                        box-shadow: none;
                        border-color: transparent;
                    }

                {Offcanvas drawer}
                
                    #offcanvasNavbar-expand-sm[role="dialog"] .offcanvas-header {
                        background-color: goldenrod;
                    }
                    
                    #offcanvasNavbar-expand-sm[role="dialog"] .offcanvas-body {
                        background-color: cornflowerblue;
                    }
                    
                    #offcanvasNavbar-expand-sm[role="dialog"] .navbar-nav {
                    background-color: yellow;
                    align-items: center;
                    }

                //     #offcanvasNavbar-expand-sm[role="dialog"] .nav-link {
                //     background-color: lightgrey;
                // }
            `}
            </style>
            <Container fluid className='justify-content-start'>
                <Row>
                    <Navbar key={'sm'} expand='sm' variant='dark' bg='dark' collapseOnSelect>
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

                                            <InputGroup>
                                                <Form.Control
                                                    type="search"
                                                    placeholder="placeholder"
                                                    className=""
                                                    aria-labelledby='searchForm'
                                                />
                                                
                                                <Button as={NavLink} href="#" variant="secondary" aria-labelledby='searchForm'><BsSearch aria-labelledby='searchForm' /></Button>
                                {/* <Nav.Link href="#action1"><Button variant="secondary" aria-labelledby='searchForm'><BsSearch aria-labelledby='searchForm' /></Button></Nav.Link> */}
                                            </InputGroup>

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