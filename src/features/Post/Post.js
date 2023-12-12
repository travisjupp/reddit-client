
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Avatar from "../Avatar/Avatar";
import 'holderjs';


function Post(props) {
    return (
        <>
            <Container fluid='sm' className='justify-content-start'>
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

                        
              <button type="button" class="btn btn-primary position-relative">
                Inbox
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  99+
                  <span class="visually-hidden">unread messages</span>
                </span>
              </button>
                        {/* --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem */}
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default Post;