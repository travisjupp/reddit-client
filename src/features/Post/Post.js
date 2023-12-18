
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Avatar from "../Avatar/Avatar.js";
import 'holderjs';


function Post(props) {
    return (
        <>
            <Container fluid className='justify-content-start'>
                <Row>
                    <Col xs={3} style={{ border: "solid 1px red" }}>Column 1</Col>
                    <Col>
                        <Card >
                            <Card.Img variant="top" data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial" />
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <div className='d-inline d-sm-none' >
                                    <Avatar name='Ren' />
                                </div>
                                <Avatar name='Jane' className='d-none d-lg-block d-xl-none'>lg breakpoint</Avatar>
                                <Avatar name='Val' className='d-block d-sm-none'>xs breakpoint</Avatar>
                                <Card.Text>Card.Text</Card.Text>

                                <button type="button" className="btn btn-primary position-relative">
                                    Inbox
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        99+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </button>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Post;