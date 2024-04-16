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
    collapseStates, setCollapseStates,
  } = props;


  const [hover, setHover] = useState(false);
  const onHover = () => setHover(true);
  const onLeave = () => setHover(false);

  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  const dispatch = useDispatch();

  // get user avatar
  useEffect(() => {
    dispatch(getUserAvatar(postAuthor));
  }, [dispatch, postAuthor])

  const avatar = useSelector(selectUserAvatar);
  const comments = useSelector(selectSubredditComments);
  const commentsStatus = useSelector(selectSubredditCommentsStatus);
  const commentsErrorState = useSelector(selectSubredditCommentsError);
  const commentsRequestedPostId = useSelector(selectSubredditCommentsPostId);
  const commentsDispatchedPost = postId === commentsRequestedPostId; // isolate the post that comments were requested for
  const commentsFailedPost = postId === commentsErrorState?.meta.arg.postId; // isolate the post that a comments request errored

  const handleCollapse = (postId) => {
    const updatedStates = { ...collapseStates };
    // make sure all comments are collapsed before expanding (avoid a dead comment button)
    for (let post in updatedStates) {
      if (post === postId) continue;
      updatedStates[post] = false;
    }
    updatedStates[postId] = !updatedStates[postId];
    setCollapseStates(updatedStates);
  }

  const toggleComments = () => {
    !collapseStates[postId] && // only fetch comments if comments not already expanded
      handleComments({ permalink: postPermalink, postId })
    // !collapseStates[postId] && handleComments({ permalink: 'INTENTOINALLY ERROR THIS OUT FOR TESTING', postId })
    handleCollapse(postId);
  }
  const renderComments = () => {
    // render comments (only for the post that dispatched)

    return (
      <>
        {commentsDispatchedPost &&
          <Collapse in={collapseStates[postId]} unmountOnExit={true}
            // onEnter={() => show && handleComments({ permalink: postPermalink, postId })} // only fetch comments if comments not already displayed}
            onExit={() => {
              console.log('onExit', postId);
              // setShow(false);
            }}
          >
            <div id={`comments-${postId}`} style={{ border: '4px double green' }}>
              {comments.map(comment => {
                return <Comment
                  key={comment.data.id}
                  commentAuthor={comment.data.author}
                  commentDate={comment.data.created_utc}
                  commentText={comment.data.body}
                  commentTextHtml={comment.data.body_html}
                />
              })}
            </div>
          </Collapse>
        }
      </>)
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
          <Card.Title>{postTitle} <div style={{ float: 'right' }}>id: {postId} show: {collapseStates[postId] ? 'true' : 'false'}</div></Card.Title>
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
                      aria-expanded={collapseStates[postId]}
                      onClick={toggleComments}
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
                      aria-expanded={collapseStates[postId]}
                      onClick={toggleComments}
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
      {commentsStatus === 'failed' && commentsFailedPost ?
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
            aria-expanded={collapseStates[postId]}
            // className=''
            onClick={() => handleComments({ permalink: postPermalink, postId })}
          >Retry</Button>
        </Toaster> :
        null
      }
      {renderComments()}

    </>
  )
}

export default Post;