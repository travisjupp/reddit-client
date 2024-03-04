import React from "react";
import { useDispatch } from "react-redux";

function Comment(props) {
    const { comments } = props;
    const dispatch = useDispatch();



    return (
        <>



            <p>{comments[0].data.parent_id}</p>

            {comments.map((comment) => {
                return (
                    <>
                        <p>{comment.data.body}</p>

                    </>
                )

            })}
        </>
    )
}

export default Comment;