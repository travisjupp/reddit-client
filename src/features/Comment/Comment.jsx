import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Stack } from "react-bootstrap";
import Avatar from "../Avatar/Avatar";
import { selectUserAvatar } from "../../store/subredditPostsSlice";
import { getUserAvatar } from "../api/reddit";
import validateAvatarImgURL from '../../utils/validateImgURL.js';


function Comment(props) {
    const { comment, show } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserAvatar(comment.data.author));

    }, [dispatch, comment.data.author])
    const avatar = useSelector(selectUserAvatar);


    return (

        <>
            <Card className={show ? null : 'd-none'}>
                <Card.Body>
                    <Card.Title>

                        <Stack direction="horizontal" gap={3}>
                            <div className="p-2">
                                <Avatar
                                    name={comment.data.author}
                                    src={validateAvatarImgURL(avatar[comment.data.author])}
                                /> {comment.data.author}
                            </div>



                            <div className="p-2 ms-auto">{new Date(comment.data.created_utc * 1000).toString()}</div>
                        </Stack>


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