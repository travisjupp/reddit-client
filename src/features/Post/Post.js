import React from "react";
import Card from "react-bootstrap/Card";
import Avatar from "../Avatar/Avatar";
import 'holderjs';

function Post(props) {
    return (
        <>
         <Card >
            <Card.Img variant="top" data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial"
              style={{ borderRadius: '24px' }} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>

              <Avatar name='Ren' />
              <Avatar name='Jane' />
              <Avatar name='Val' />

              <Card.Text>Card.Text</Card.Text>

{/* 
              <button type="button" class="btn btn-primary position-relative">
                Inbox
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  99+
                  <span class="visually-hidden">unread messages</span>
                </span>
              </button> */}
              {/* --bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem */}
            </Card.Body>
          </Card>
        </>
    )
}

export default  Post;