import React, { useState } from 'react';
import { Button, Container, Col, Row, Form, Nav, Navbar, NavLink, NavDropdown, Offcanvas, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getSubredditPosts } from '../api/reddit';
import { BsSearch } from "react-icons/bs/index.js";
import Sidebar from '../Sidebar/Sidebar';

const nbToggle = {
    border: 'none',
}

function Header(props) {
    const [show, setShow] = useState(false);
    // const handleShow = () => setShow(!show);
    const dispatch = useDispatch();

    const [data, setData] = useState(
        {
            searchValue: ""
        }
    );
    const handleChange = (e) => {
        const key = e.target.id;
        setData((prev) => {
            console.log('prev', prev)
            // console.log({name: 'chris', name: 'dan'});

            // console.log({ ...prev, newKey: e.target.value })
            console.log({ [key]: e.target.value })
            console.log({ ...prev, [key]: e.target.value })
            return { ...prev, [key]: e.target.value };
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(getSubredditPosts(data.searchValue));
        console.log(`handleSubmit: getSubredditPosts(${data.searchValue})`);
    }

    const handlePosts = () => {

        

    }

    return (
        <>
            {/* <Container fluid className='justify-content-start'> */}
            {/* <Row> */}
            <Navbar key='md' expand='md' variant='dark' bg='dark'
                collapseOnSelect
                onSelect={(key, event) => {
                    console.log('key', key, '\nevent', event)
                }}
                onToggle={expanded => console.log('expanded=', expanded)}
            >
                <Col xs={3} className='d-flex' style={{ border: "1px solid red" }}>

                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} style={nbToggle} />
                    <Navbar.Brand>Navbar.Brand</Navbar.Brand>

                    {/* <Button href='#' onClick={handleShow} >X</Button> */}
                    <Nav className="justify-content-start pe-3">
                        <Nav.Link href="#action1">Home</Nav.Link>
                    </Nav>

                </Col>
                <Col id='headerRightCol'>

                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-sm`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                        placement="start"
                        scroll
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Form className="d-flex flex-grow-1" aria-label='Search' id='searchForm' onSubmit={handleSubmit}>
                                <InputGroup>
                                    {/* <Form.Label htmlFor='searchValue'>{data.searchValue}</Form.Label> */}
                                    <Form.Control
                                        type="search"
                                        id="searchValue"
                                        value={data.searchValue}
                                        onChange={handleChange}
                                        placeholder="placeholder"
                                        className=""
                                        aria-labelledby='searchForm'
                                    />
                                    {/* rendering search button as NavLink for Offcanvas navbar to collapse after clicking (collapseOnSelect) */}
                                    <Button
                                        type="submit"
                                        eventKey="1"
                                        as={Nav.Link}
                                        // href="#" 
                                        onClick={handleSubmit}
                                        variant="secondary"
                                        aria-labelledby='searchForm'><BsSearch aria-labelledby='searchForm' /></Button>
                                </InputGroup>
                            </Form>
                            {/* .d-none .d-md-block .d-xl-none .d-xxl-none will hide the element for all screen sizes except on medium and large devices. */}
                            <div className="d-block d-md-none">
                                {/* visible only on xs, sm */}
                                <Sidebar />
                            </div>


                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Col>

            </Navbar>
            {/* </Row> */}
            {/* </Container> */}
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