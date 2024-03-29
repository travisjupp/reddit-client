import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Stack, Collapse, Placeholder } from "react-bootstrap";
import Avatar from "../Avatar/Avatar";
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectUserAvatar } from "../../store/subredditPostsSlice";
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
        show,
    } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserAvatar(commentAuthor));
    }, [dispatch, commentAuthor])
    const avatar = useSelector(selectUserAvatar);

    const commentsStatus = useSelector(selectSubredditCommentsStatus);



    while (commentsStatus === 'loading') {
        // while (commentsStatus === 'succeeded') {
        return (
            <Card
            //  className={show ? 'comment' : 'd-none comment'}
            >
                <Card.Body>
                    <Placeholder as={Card.Title} animation="glow">
                        <Stack direction="horizontal" gap={3}>
                        <div className="w-100">
                                <Avatar
                                    name={commentAuthor}
                                    // src={validateAvatarImgURL(avatar[commentAuthor])}
                                /> <Placeholder children={commentAuthor} />
                            </div>
                            <div className="p-2 ms-auto">
                                <Placeholder children={commentAuthor}/>
                            </div>

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
            >
                <Card.Body>
                    <Card.Title>
                        <Stack direction="horizontal" gap={3}>
                            <div>
                                <Avatar
                                    name={commentAuthor}
                                    src={validateAvatarImgURL(avatar[commentAuthor])}
                                /> {commentAuthor}
                            </div>
                            <div className="p-2 ms-auto">{new Date(commentDate * 1000).toString()}</div>
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