import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Stack, Placeholder} from "react-bootstrap";
import Avatar from "../Avatar/Avatar";
import {DateTime} from 'luxon';
import { selectUserAvatars } from "../../store/subredditPostsSlice";
import { getUserAvatar } from "../api/reddit";
import validateAvatarImgURL from '../../utils/validateImgURL.js';
import formatPostText from "../../utils/formatPostText.js";
import Markdown from "react-markdown";
import rehypeRaw from 'rehype-raw';


import { selectSubredditCommentsStatus } from "../../store/subredditCommentsSlice.js";


function Comment(props) {
    const {
        commentAuthor,
        commentDate,
        commentText,
        commentTextHtml,
    } = props;

    const dispatch = useDispatch();

    const avatars = useSelector(selectUserAvatars);
    useEffect(() => {
            console.log('<Comment>dispatching for ', commentAuthor);
            const promise = dispatch(getUserAvatar(commentAuthor));
            return () => {
                promise.abort();
            }
    }, [dispatch, commentAuthor]);

    const commentsStatus = useSelector(selectSubredditCommentsStatus);

    if (commentsStatus === 'loading') {
    // if (commentsStatus === 'succeeded') {
        return (
            <Card
            //  className={show ? 'comment' : 'd-none comment'}
            >
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Stack direction="horizontal" gap={3}>
                            <Avatar name={commentAuthor ? commentAuthor : 'placeholder name'} />
                            <Placeholder children="username" />
                            <Placeholder className="ms-auto" children="date" />
                        </Stack>
                    </Placeholder>
                    <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={12} />
                    </Placeholder>
                </Card.Body>
            </Card>
        )
    }

    if (commentsStatus === 'succeeded') {
        return (
            <Card
            //  className={show ? 'comment' : 'd-none comment'}
            style={{backgroundColor: "gainsboro"}}
            >
                <Card.Body>
                    <Card.Title className="h6">
                        <Stack direction="horizontal" gap={2}>
                            <div>
                                <Avatar
                                    name={commentAuthor}
                                    src={validateAvatarImgURL(avatars[commentAuthor])}
                                />
                            </div>
                            <div>{commentAuthor}</div>
                            <div className="fw-light ms-auto">{DateTime.fromSeconds(commentDate || 0).toRelative()}</div>
                        </Stack>
                    </Card.Title>
                    <Card.Text as='div'>{/* Render as 'div' to avoid <p> nesting; <p> cannot appear as a descendant of <p>. */}
                        <Markdown rehypePlugins={[rehypeRaw]}>{formatPostText(commentTextHtml, commentText, 300)}</Markdown>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default Comment;
