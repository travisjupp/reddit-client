import React, {useEffect} from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Avatar from "../Avatar/Avatar.js";
// import 'holderjs';

import Holder from 'holderjs';

function Post(props) {
    const {avatarName} = props;
    
    useEffect(() => {
        Holder.run({
            images:".card-img-top"
        });
    });

return (
        <>
            <Card >
                <Card.Img variant="top" data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Avatar name={Math.random()}/>
                    <Avatar name={Math.random()}/>
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

        </>
    )
}

export default Post;