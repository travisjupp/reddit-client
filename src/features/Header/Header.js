import React from 'react';
import { NavbarBrand } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Header(props) {
    return (
        <>
            <Navbar key={'lg'} expand={'lg'} variant='dark' bg='dark'>
                <Container fluid='lg' className=''>
                <Navbar.Brand>Navbar.Brand</Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;