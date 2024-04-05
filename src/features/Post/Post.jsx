import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAvatar } from '../api/reddit';
import { selectUserAvatar } from '../../store/subredditPostsSlice';
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment"
import Markdown from 'react-markdown';
import Holder from 'holderjs';

import { BsChatQuote, BsChatQuoteFill, BsArrowUpCircle, BsArrowUpCircleFill, BsArrowDownCircle, BsArrowDownCircleFill, BsShare, BsShareFill } from "react-icons/bs";
import { Button, Container, Row, Col, Card, Badge, Stack, Collapse, Fade, Placeholder } from 'react-bootstrap';
import { selectSubredditComments, selectSubredditCommentsError, selectSubredditCommentsStatus, selectSubredditCommentsPostId } from '../../store/subredditCommentsSlice.js';
import validateAvatarImgURL from '../../utils/validateImgURL.js';
import formatPostText from '../../utils/formatPostText.js';

import rehypeRaw from 'rehype-raw';
import Toaster from '../../components/Toast/Toast.jsx';
import { getSubredditComments } from '../api/reddit';


function Post(props) {
  const { postId, postAuthor, postDate, postImgSrc, postTitle, postText, postTextHtml, altText,
    postPermalink, numberOfComments, handleComments,

    nodeIdGlobal, setNodeIdGlobal // testing lifted state for id'ing what Post component was clicked
  } = props;

  const commentsRef = useRef(null);



  const [nodeIdLocal, setNodeIdLocal] = useState(null);
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);

  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  const dispatch = useDispatch();

  // Get user avatar
  useEffect(() => {
    dispatch(getUserAvatar(postAuthor));
  }, [dispatch, postAuthor])

  const avatar = useSelector(selectUserAvatar);
  const comments = useSelector(selectSubredditComments);
  const commentsStatus = useSelector(selectSubredditCommentsStatus);
  const commentsErrorState = useSelector(selectSubredditCommentsError);
  const commentsRequestedPostId = useSelector(selectSubredditCommentsPostId);

  // testing lifted state for id'ing what Post component was clicked
  const handleGetId = (e) => {
    setNodeIdGlobal(e.target.parentNode.id);
    setNodeIdLocal(e.target.parentNode.id);
  }

  const renderComments = () => {
    // render comments (only for the post that dispatched)
    if (postId === commentsRequestedPostId) {
      return (
        comments.map((comment) => {
          return <Comment
            key={comment.data.id}
            commentAuthor={comment.data.author}
            commentDate={comment.data.created_utc}
            commentText={comment.data.body}
            commentTextHtml={comment.data.body_html}
          />
        })
      )
    }
  }

  const upCircle = () => <BsArrowUpCircle size='1.5em' color='#000000' />;
  const upCircleFill = () => { return <BsArrowUpCircleFill size='1.5em' color='#000000'></BsArrowUpCircleFill> };

  return (
    <>
      {/* <a href={postPermalink}>{postPermalink}</a> */}
      <Card id={postId}>
        {postImgSrc ? <Card.Img
          variant="top"
          src={postImgSrc}
          // data-src="holder.js/100x50?auto=yes&textmode=exact&theme=industrial"
          alt={altText}
        /> : null}
        <Card.Body>
          <Card.Title>{postTitle} id: {postId}</Card.Title>
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatar[postAuthor])} /> {postAuthor}
          <Card.Text as='div'>{/* Render as 'div' to avoid <pre> nesting; <pre> cannot appear as a descendant of <p>. */}
            <Container fluid className="p-0">
              {/* show on xs and sm screen size only */}
              <Row className='d-md-none'>
                <Markdown className="d-md-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 60) + '...show on xs sm only'}</Markdown>
              </Row>
              <Row className='align-items-end'>
                {/* show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Stack direction="horizontal" gap={1} style={{}} className='justify-content-start'>

                    <a onMouseOver={onHover} onMouseLeave={onLeave} href='#'>{hover ? upCircleFill() : upCircle()}</a>
                    {/* <BsArrowUpCircle size='1.5em' color='#000000' /> */}

                    <BsArrowDownCircle size='1.5em' color='#000000' />

                    <Badge pill className=''>+4</Badge>

                  </Stack>
                </Col>
                {/* show on md and larger */}
                <Col className="d-none d-md-block">
                  <Stack direction="horizontal" gap={2} style={{}} className='justify-content-start'>
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
                  {/* <Markdown className="d-md-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 60) + '...show on xs sm only'}</Markdown> */}
                  <div className="d-md-none date">{new Date(postDate * 1000).toString()}</div>
                  {/* show on md and lg screen size only */}
                  <Markdown className="d-none d-md-block d-xl-none d-xxl-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 200) + '...show on md and lg only'}</Markdown>

                  {/* show on xl and xxl screen size only */}
                  <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 1200) + '...show on xl and xxl only'}</Markdown>

                </Col>
                {/* show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Stack direction="horizontal" gap={1} style={{}} className='justify-content-end'>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsShare size='1.5em' color='#000000' />
                    </div>
                    <div className='vr' height='5px'></div>
                    <div
                      role="button"
                      // data-bs-toggle="collapse"
                      // data-bs-target={`#comments-${postId}`}
                      aria-controls={`comments-${postId}`}
                      // aria-controls={commentsRef}
                      aria-expanded={show}
                      onClick={(e) => {
                        handleGetId(e);
                        if (!show) {handleComments({ permalink: postPermalink, postId })} // only fetch comments if comments not already displayed
                        setShow(!show);
                      }}

                      style={{ border: 'solid 1px red', zIndex: '3' }}
                      id={`button-${postId}`}
                    >
                      <BsChatQuote size='1.5em' color='#000000' />
                    </div>
                    <Badge pill>
                      {/* Overlay actual number of comments when comments clicked/loaded.
                            numberOfComments not accurate, but good enough on initial load.  */}
                      {comments.length !== 0 && comments[0].data.parent_id === `t3_${postId}` ? comments.length : numberOfComments}
                    </Badge>
                  </Stack>
                </Col>

                {/* show on md and larger */}
                <Col className='d-none d-md-block'>
                  <Stack direction="horizontal" gap={2} style={{}} className='justify-content-end'>
                    <div
                      role="button"
                      // data-bs-toggle="collapse"
                      // data-bs-target={`#comments-${postId}`}
                      aria-controls={`comments-${postId}`}
                      aria-expanded={show}
                      onClick={() => {
                        // handleComments({ permalink: postPermalink, postId });
                        // handleComments({ permalink: 'TEST ERROR', postId });
                        setShow(!show);

                      }}
                      style={{ border: 'solid 1px red', zIndex: '3' }}
                    >
                      <BsChatQuote size='3em' color='#000000' />

                      <Badge pill className='position-absolute translate-middle-x'>
                        {/* Overlay actual number of comments when comments clicked/loaded. 
                          numberOfComments not accurate, but good enough on initial load.  */}
                        {numberOfComments}
                      </Badge>
                      <Badge pill className='position-absolute translate-middle-x'>
                        {/* Overlay actual number of comments when comments clicked/loaded. 
                          numberOfComments not accurate, but good enough on initial load.  */}
                        {comments.length !== 0 ? comments[0].data.parent_id === `t3_${postId}` ? comments.length : null : numberOfComments}
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

      {/* Render Comments */}

      {/* If fetching comments failed pop toast only for the post for which it was originally requested */}
      {commentsStatus === 'failed' && postId === commentsErrorState.meta.arg.postId ?

        <Toaster header={`Get Comments ${commentsErrorState.message}`} variant='dark'>
          <pre>
            {commentsErrorState.payload}<br />
            {postTitle}
            <hr />
            <strong>{`${commentsErrorState.type}`}</strong>
            <code>{JSON.stringify(commentsErrorState)}</code>
          </pre>
          <Button
            // data-bs-toggle="collapse"
            // data-bs-target={`#comments-${postId}`}
            aria-controls={`comments-${postId}`}
            aria-expanded={show}
            // className=''
            onClick={() => handleComments({ permalink: postPermalink, postId }) && setShow(!show)}
          >Retry</Button>
        </Toaster> :
        null
      }
      {postId === commentsRequestedPostId ?
        <Collapse
          in={show}
          // mountOnEnter={true}
          unmountOnExit={true}
          // appear={true}
          // onEnter={renderComments}
          // onEnter={() => handleComments({ permalink: postPermalink, postId })}
          // onEntering={() => handleComments({ permalink: postPermalink, postId })}
          // timeout={600}
          timeout={{
            appear: 500,
            enter: 300,
            exit: 500,
          }}
        >
          <div
            id={`comments-${postId}`}
            ref={commentsRef}
            style={{ border: '4px double red' }}
          >

            {renderComments()}

          </div>
        </Collapse> :
        null
        // <h1>NULL</h1>
      }
    </>
  )
}

export default Post;