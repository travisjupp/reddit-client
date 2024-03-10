import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAvatar } from '../api/reddit';
import { selectUserAvatar } from '../../store/subredditPostsSlice';
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment"
import Markdown from 'react-markdown';
import Holder from 'holderjs';

import { BsChatQuote, BsChatQuoteFill, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircle, BsArrowDownCircleFill, BsShare, BsShareFill } from "react-icons/bs";
import { Button, Container, Row, Col, Card, Badge, Stack } from 'react-bootstrap';
import { selectSubredditComments, selectSubredditCommentsError, selectSubredditCommentsStatus } from '../../store/subredditCommentsSlice.js';
import validateAvatarImgURL from '../../utils/validateImgURL.js';

import rehypeRaw from 'rehype-raw';
import he from 'he';

function Post(props) {
  const { id, postAuthor, postImgSrc, postTitle, postText, postTextHtml, altText,
    postPermalink, numberOfComments, handleComments } = props;

  const [show, setShow] = useState(false);

  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserAvatar(postAuthor));

  }, [dispatch, postAuthor])

  const avatar = useSelector(selectUserAvatar);
  const comments = useSelector(selectSubredditComments);

  const formatPost = (postTextHtml, postText, charLength) => {
    return postTextHtml !== null ?
      he.decode(postTextHtml)
        .substring(0, charLength) :
      postText !== null ?
        postText.substring(0, charLength) :
        "postText is null"
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
          <Card.Title>{postTitle} id: {id}</Card.Title>
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatar[postAuthor])} /> {postAuthor}
          <Card.Text as='div'>{/* Render as 'div' to avoid <pre> nesting; <pre> cannot appear as a descendant of <p>. */}
            <Container>
              <Row>
                <Col>
                  <Stack direction="horizontal" gap={2} style={{ height: '100%', justifyContent: 'center' }}>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsArrowUpCircle size='3em' color='#000000' />
                    </div>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsArrowDownCircle size='3em' color='#000000' />
                      <Badge pill className='position-absolute translate-middle-x'>-13</Badge>
                    </div>
                  </Stack>
                </Col>
                <Col xs sm={5} xl={7}>

                  {/* show on xs and sm screen size only */}
                  {/* hide on md and wider screens */}
                  {/* <Markdown className="d-md-none">{postText.substring(0, 60) + '...show on xs sm only'}</Markdown> */}
                  <Markdown className="d-md-none" rehypePlugins={[rehypeRaw]} >{formatPost(postTextHtml, postText, 60) + '...show on xs sm only'}</Markdown>

                  {/* show on md and lg screen size only */}
                  {/* hide on screens smaller than md */}
                  {/* <Markdown className="d-none d-md-block d-xl-none d-xxl-none">{postText.substring(0, 200) + '...show on md and lg only'}</Markdown> */}
                  <Markdown className="d-none d-md-block d-xl-none d-xxl-none" rehypePlugins={[rehypeRaw]} >{formatPost(postTextHtml, postText, 200) + '...show on md and lg only'}</Markdown>

                  {/* show on xl and xxl screen size only */}
                  {/* hide on screens smaller than xl */}
                  {/* <Markdown className="d-none d-xl-block">{postText.substring(0, 500) + '...show on xl and xxl only'}</Markdown> */}
                  <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >{formatPost(postTextHtml, postText, 500) + '...show on xl and xxl only'}</Markdown>

                  {/* <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >
                    {postTextHtml !== null ? // if HTML exists, decode html-entities and render
                      he.decode(postTextHtml).substring(0, 500) + '...show on xl and xxl only' :
                      postText}
                  </Markdown> */}
                  {/* <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >
                    {formatPost(postTextHtml, postText, 300)}
                  </Markdown> */}


                </Col>
                <Col>
                  <Stack direction="horizontal" gap={2} style={{ height: '100%', justifyContent: 'center' }}>
                    <div onClick={() => { handleComments(postPermalink); setShow(!show) }} style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsChatQuote size='3em' color='#000000' />
                      <Badge pill className='position-absolute translate-middle-x'>
                        {numberOfComments}
                        {/* {comments.length !== 0 ? comments[0].data.parent_id === `t3_${id}` ? comments.length : null : null} */}
                      </Badge>
                      <Badge pill className='position-absolute translate-middle-x'>
                        {/* Overlay actual number of comments when comments clicked/loaded. 
                          numberOfComments not accurate, but good enough on initial load,  */}
                        {comments.length !== 0 ? comments[0].data.parent_id === `t3_${id}` ? comments.length : null : null}
                      </Badge>
                    </div>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsShare size='3em' color='#000000' />
                    </div>
                  </Stack>
                </Col>
              </Row>
            </Container>
          </Card.Text>
        </Card.Body>
        {/* Make Card a hyperlink, all other links contained in card need a higher z-index */}
        {/* <a href={postPermalink} className='stretched-link' /> */}
      </Card>


      {/* if any comments exist display them below post with matching id */
        comments.length !== 0 ?
          comments[0].data.parent_id === `t3_${id}` ?
            comments.map((comment) => {
              return (
                <Comment
                  key={comment.data.id}
                  comment={comment}
                  show={show}
                />
              )
            }) :
            null :
          null
      }
    </>
  )
}

export default Post;