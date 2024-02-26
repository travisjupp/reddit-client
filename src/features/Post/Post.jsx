import React, { useEffect, useState } from 'react';
import Card from "react-bootstrap/Card";
import Avatar from "../Avatar/Avatar";
import Markdown from 'react-markdown';
import Holder from 'holderjs';
import { getUserAvatar } from '../api/reddit';
import { selectUserAvatar } from '../../store/subredditPostsSlice';
import { useDispatch, useSelector } from 'react-redux';


function Post(props) {
  const { postAuthor, avatarName, postImgSrc, postTitle, postText, altText } = props;
  // console.log('postImgSrc',postImgSrc);
  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  // const [avatar, setAvatar] = useState('');
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUserAvatar(postAuthor));
  }, [dispatch])
  
  const avatar = useSelector(selectUserAvatar);
  // setAvatar(userAvatar);
  // const avatar = useSelector(selectUserAvatar);
  console.log('avatar:', avatar);
  console.log('postAuthor',postAuthor);
  // console.log('currentAvatar:', currentAvatar);
  const validateAvatarImgURL = (url) => {
    if (!url) {
      return;
    }
    const re = /.*png|.*jpg/g;
    return url.match(re) ? url.match(re)[0] : null;
  }
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
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatar[postAuthor])} />{postAuthor}
          <Card.Text as='div' style={{ wordBreak: 'break-all' }}>
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