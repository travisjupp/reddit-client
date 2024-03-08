import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";
import Avatar from "../Avatar/Avatar";
import { selectUserAvatar } from "../../store/subredditPostsSlice";
import { getUserAvatar } from "../api/reddit";
import validateAvatarImgURL from '../../utils/validateImgURL.js';


function Comment(props) {
    const { comment, postAuthor } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserAvatar(comment.data.author));

    }, [dispatch, comment.data.author])
    const avatar = useSelector(selectUserAvatar);


    return (

        <>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <Avatar
                            name={comment.data.author}
                            src={validateAvatarImgURL(avatar[comment.data.author])}
                        /> {comment.data.author}
                    </Card.Title>
                    <Card.Text>
                        {comment.data.body}
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )


}

export default Comment;