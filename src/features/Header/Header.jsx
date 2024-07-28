import React, {useState} from 'react';
import {Badge, Button, Col, Form, InputGroup, Nav, Navbar, Offcanvas} from 'react-bootstrap';
import {BsFillFilterCircleFill} from "react-icons/bs";
import {useDispatch, useSelector} from 'react-redux';
import {filterPosts, selectIsPostsFiltered, unfilterPosts} from '../../store/subredditPostsSlice';
import Sidebar from '../Sidebar/Sidebar';

const nbToggle = {
    border: 'none',
};

function Header() {
    const [show, setShow] = useState(false);
    const toggleOffcanvas = () => {
        setShow(!show);
    };

    const [data, setData] = useState( { searchValue: "" });
    const isPostsFiltered = useSelector(selectIsPostsFiltered);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const key = e.target.id;
        const data = { [key]: e.target.value };
        setData(() => data);
        dispatch(filterPosts(data.searchValue));
        if (data.searchValue === "") dispatch(unfilterPosts());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // dispatch(filterPosts(data.searchValue));
        return show ? toggleOffcanvas() : null;
    };

    return (
        <>
            <Navbar key='md' expand='md' variant='dark' bg='dark'
                sticky='top'
                collapseOnSelect
                // onSelect={(key, event) => {
                //     console.log('key', key, '\nevent', event)
                // }}
                // onToggle={expanded => console.log('expanded=', expanded)}
            >
                <Col md={3} className='d-flex' style={{ border: "1px solid red" }}>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} style={nbToggle} onClick={toggleOffcanvas} />
                    <Navbar.Brand>Navbar.Brand</Navbar.Brand>
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
                        show={show}
                        onHide={toggleOffcanvas}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Form className="d-flex flex-grow-1 d-none d-md-block" aria-label='Search' id='searchForm' onSubmit={handleSubmit}>
                                <InputGroup>
                                    {/* <Form.Label htmlFor='searchValue'>{data.searchValue}</Form.Label> */}
                                    <Form.Control
                                        type="search"
                                        id="searchValue"
                                        value={data.searchValue}
                                        onChange={handleChange}
                                        placeholder="Filter Posts 😀"
                                        className=""
                                        aria-labelledby="searchForm"

                                    />
                                    {/* rendering search button as NavLink for Offcanvas navbar to collapse after clicking (collapseOnSelect) */}
                                    <Button
                                        type="submit"
                                        eventKey="1"
                                        as={Nav.Link}
                                        // href="#" 
                                        onClick={handleSubmit}
                                        variant="secondary"
                                        aria-labelledby='searchForm'>
                                    {/* <BsSearch aria-labelledby='searchForm' /> */}
                                    <BsFillFilterCircleFill aria-labelledby='searchForm' />
                                        { isPostsFiltered && <Badge pill bg="danger"
                                            style={{position: "absolute", top: 9, right: 9, fontSize: 1, width: 8, height: 8}}
                                        >&nbsp;</Badge> }
                                    </Button>
                                </InputGroup>
                            </Form>
                            {/* .d-none .d-md-block .d-xl-none .d-xxl-none will hide the element for all screen sizes except on medium and large devices. */}
                            <div className="d-block d-md-none">
                                {/* visible only on xs, sm */}
                                <Sidebar toggleOffcanvas={toggleOffcanvas} />
                            </div>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Col>
            </Navbar>
        </>
    )
}

export default Header;
