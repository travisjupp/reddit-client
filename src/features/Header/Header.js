import React from 'react';
import { NavbarBrand } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

const nbToggle = {
    border: 'none',
}

function Header(props) {
    return (
        <>
            <style type='text/css'>
                {`
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

                    #offcanvasNavbar-expand-sm[role="dialog"] .nav-link {
                    background-color: lightgrey;
                }
            `}
            </style>
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
                            // border: 'solid 1px red'
                        }}>
                            <Nav className="justify-content-start flex-grow-1 pe-3">
                                <Nav.Link href="#action1">Home</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;