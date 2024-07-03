import Holder from 'holderjs';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {Badge, Button, Card, Col, Collapse, Container, Row, Stack} from 'react-bootstrap';
import {BsArrowDownCircle, BsArrowUpCircle, BsArrowUpCircleFill, BsChatQuote, BsShare} from "react-icons/bs";
import Markdown from 'react-markdown';
import {useDispatch, useSelector} from 'react-redux';
import {selectSubredditComments, selectSubredditCommentsError, selectSubredditCommentsPostId, selectSubredditCommentsStatus} from '../../store/subredditCommentsSlice.js';
import {selectUserAvatars} from '../../store/subredditPostsSlice';
import formatPostText from '../../utils/formatPostText.js';
import validateAvatarImgURL from '../../utils/validateImgURL.js';
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import {getUserAvatar} from '../api/reddit';

import rehypeRaw from 'rehype-raw';
import Toaster from '../../components/Toast/Toast.jsx';

function Post(props) {
  const { postId, postAuthor, postDate, postImgSrc, postTitle, postText, postTextHtml, altText,
    postPermalink, score, numberOfComments, handleComments,
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
  const avatars = useSelector(selectUserAvatars);

  // const getAvatar = useCallback(() => {
  //   if (!avatars[postAuthor] && postAuthor !== undefined) { // check if avatar is cached before dispatching fetch (avoid hitting rate-limits)
  //     return dispatch(getUserAvatar(postAuthor));
  //   }
  // }, [avatars, postAuthor, dispatch]);

  // useEffect(() => {
  //   const promise = getAvatar();
  //   return () => {
  //     console.log('unmounted maybe? =>', postId)
  //     promise.abort();
  //   }
  // }, [getAvatar])

  // get user avatar
  useEffect(() => {
    if (!avatars[postAuthor] && postAuthor !== undefined) { // check if avatar is cached before dispatching fetch (avoid hitting rate-limits)
    const promise = dispatch(getUserAvatar(postAuthor));
    return () => {
      promise.abort('Aborted from Post');
    }
    };
  }, []);

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
    // !collapseStates[postId] && handleComments({ permalink: 'INTENTIONALLY ERROR THIS OUT FOR TESTING', postId })
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
            <div id={`comments-wrapper-${postId}`} style={{ border: '4px double green' }}>
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
      <Card id={postId}>
        {postImgSrc ? <Card.Img
          variant="top"
          src={postImgSrc}
          alt={altText}
        /> : null}
        <Card.Body>
          <Card.Title>{postTitle} <div style={{ float: 'right' }}>id: {postId} show: {collapseStates[postId] ? 'true' : 'false'}</div></Card.Title>
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatars[postAuthor])} /> {postAuthor}
          <Card.Text as='div'>{/* Render as 'div' to avoid <pre> nesting; <pre> cannot appear as a descendant of <p>. */}
            <Container fluid className="p-0">

              {/* MOBILE POSTTEXT show on xs and sm screen size only */}
              <Row className='d-md-none'>
                <Markdown className="d-md-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 60) + '...show on xs sm only'}</Markdown>
              </Row>

              <Row className='align-items-end'>

                {/* MOBILE ACTION BAR (left side) show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Stack direction="horizontal" gap={1} style={{}} className='justify-content-start'>
                    <a onMouseOver={onHover} onMouseLeave={onLeave} href='#'>{hover ? upCircleFill() : upCircle()}</a>
                    {/* <BsArrowUpCircle size='1.5em' color='#000000' /> */}
                    <BsArrowDownCircle size='1.5em' color='#000000' />
                    <Badge pill className=''>{score}</Badge>
                  </Stack>
                </Col>

                {/* DESKTOP ACTION BAR (left side) show on md and larger */}
                <Col className="d-none d-md-block">
                  <Stack direction="horizontal" gap={2} style={{}} className='justify-content-start'>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsArrowUpCircle size='3em' color='#000000' />
                    </div>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsArrowDownCircle size='3em' color='#000000' />
                      <Badge pill className='position-absolute translate-middle-x'>{score}</Badge>
                    </div>
                  </Stack>
                </Col>
                <Col xs sm={5} xl={7}>

                  {/* MOBILE DATE show on xs and sm screen size only */}
                  <div className="d-md-none date small" style={{ border: 'solid 1px red' }}>
                    {/* {new Date(postDate * 1000).toString()} */}
                    {moment.unix(postDate).fromNow()}
                  </div>
                  
                  {/* DESKTOP DATE show on md and lg screen size only */ }
                  <div className="d-none d-md-block d-xl-none d-xxl-none date" style={{ border: 'solid 1px red' }}>
                  {moment.unix(postDate).fromNow()}
                  </div>

                  {/* DESKTOP DATE show on xl and xxl screen size only */ }
                  <div className="d-none d-xl-block date" style={{ border: 'solid 1px blue' }}>
                  {moment.unix(postDate).fromNow()}
                  </div>

                  {/* DESKTOP POSTTEXT show on md and lg screen size only */}
                  <Markdown className="d-none d-md-block d-xl-none d-xxl-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 200) + '...show on md and lg only'}</Markdown>

                  {/* DESKTOP POSTTEXT show on xl and xxl screen size only */}
                  <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 1200) + '...show on xl and xxl only'}</Markdown>

                </Col>

                {/* MOBILE ACTION BAR (right side) show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Stack direction="horizontal" gap={1} style={{}} className='justify-content-end'>
                    <div style={{ border: 'solid 1px red', zIndex: '3' }}>
                      <BsShare size='1.5em' color='#000000' />
                    </div>
                    <div className='vr' height='5px'></div>
                    <div
                      role="button"
                      // data-bs-toggle="collapse"
                      // data-bs-target={`#comments-wrapper-${postId}`}
                      aria-controls={`comments-wrapper-${postId}`}
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

                {/* DESKTOP ACTION BAR (right side) show on md and larger */}
                <Col className='d-none d-md-block'>
                  <Stack direction="horizontal" gap={2} style={{}} className='justify-content-end'>
                    <div
                      role="button"
                      // data-bs-toggle="collapse"
                      // data-bs-target={`#comments-wrapper-${postId}`}
                      aria-controls={`comments-wrapper-${postId}`}
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
            // data-bs-target={`#comments-wrapper-${postId}`}
            aria-controls={`comments-wrapper-${postId}`}
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
