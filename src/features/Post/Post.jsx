import React, { useEffect } from 'react';
import Card from "react-bootstrap/Card";
import Avatar from "../Avatar/Avatar";
// import 'holderjs';
import Markdown from 'react-markdown';

import Holder from 'holderjs';

function Post(props) {
    const { avatarName, postImgSrc, postTitle, postText, altText } = props;
    // console.log('postImgSrc',postImgSrc);
    useEffect(() => {
        Holder.run({
            images: ".card-img-top"
        });
    }, []);

    return (
        <>
            <Card>
                {postImgSrc ? <Card.Img
                    variant="top"
                    src={postImgSrc}
                    // data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial"
                    alt={altText}
                /> : null}
                <Card.Body>
                    <Card.Title>{postTitle}</Card.Title>
                    <Avatar name={Math.random()} />
                    <Avatar name={Math.random()} />
                    <Card.Text as='div' style={{ wordBreak: 'break-all' }}>
                        {/* {postText} */}
                        <Markdown>{postText}</Markdown>
                    </Card.Text>

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