import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAvatar } from '../api/reddit';
import { selectUserAvatar } from '../../store/subredditPostsSlice';
import Card from "react-bootstrap/Card";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Avatar from "../Avatar/Avatar";
import Markdown from 'react-markdown';
import Holder from 'holderjs';

import { BsChatQuote, BsChatQuoteFill, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircle, BsArrowDownCircleFill, BsShare, BsShareFill } from "react-icons/bs";
import { Button, Container, Row, Col } from 'react-bootstrap';



function Post(props) {
  const { postAuthor, avatarName, postImgSrc, postTitle, postText, altText, postPermalink } = props;
  // console.log('postImgSrc',postImgSrc);
  console.log('postText',postText);
  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserAvatar(postAuthor));
  }, [dispatch])

  const avatar = useSelector(selectUserAvatar);
  const validateAvatarImgURL = (url) => {
    if (!url) {
      return;
    }
    const re = /.*png|.*jpg|.*jpeg/;
    return url.match(re) ? url.match(re)[0] : null;
  }
  return (
    <>
      {/* <a href={postPermalink}>{postPermalink}</a> */}
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
            <Container>
              <Row>
                <Col>
                  <Stack direction="horizontal" gap={2} style={{ height: '100%', justifyContent: 'center' }}>
                    <div style={{ border: 'solid 1px red' }} className='position-relative'>
                    <BsArrowUpCircle size='3em' color='#000000' />
                    <Badge pill className='position-absolute translate-middle'>13</Badge>
                  </div>
                  <div style={{ border: 'solid 1px red' }} className='position-relative'>
                    <BsArrowDownCircle size='3em' color='#000000' />
                    <Badge pill className='position-absolute translate-middle'>13</Badge>
                  </div>
                  </Stack>
                </Col>
                <Col>
                  <Markdown>{postText}</Markdown>
                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2} style={{ height: '100%', justifyContent: 'center' }}>
                    <div style={{ border: 'solid 1px red' }} className='position-relative'>
                      <BsChatQuote size='3em' color='#000000' />
                      <Badge pill className='position-absolute translate-middle'>13</Badge>
                    </div>
                    <div style={{ border: 'solid 1px red' }} className='position-relative'>
                      <a href='#'>
                        <BsShare size='3em' color='#000000' />
                      </a>
                    </div>
                  </Stack>
                </Col>
              </Row>
            </Container>
            {/* <Stack direction="horizontal" gap={1}> */}
            {/* <div style={{ border: 'solid 1px red' }} className='position-relative'>
                <BsArrowUpCircle size='3em' color='#000000' />
                <Badge pill className='position-absolute translate-middle'>13</Badge>
              </div>
              <div style={{ border: 'solid 1px red' }} className='position-relative'>
                <BsArrowDownCircle size='3em' color='#000000' />
                <Badge pill className='position-absolute translate-middle'>13</Badge>
              </div> */}

            {/* <div style={{ border: 'solid 1px red' }} className='position-relative'> */}
            {/* <Markdown>{postText}</Markdown> */}
            {/* </div> */}

            {/* <div style={{ border: 'solid 1px red' }} className='position-relative'>
                <BsChatQuote size='3em' color='#000000' />
                <Badge pill className='position-absolute translate-middle'>13</Badge>
              </div>
              <div style={{ border: 'solid 1px red' }} className='position-relative'>
                <a href='#'>
                  <BsShare size='3em' color='#000000' />
                </a>
              </div> */}
            {/* </Stack> */}
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