import Holder from 'holderjs';
import {DateTime} from 'luxon';
import React, {useEffect} from 'react';
import {Button, Card, Col, Collapse, Container, Row} from 'react-bootstrap';
import Markdown from 'react-markdown';
import {useDispatch, useSelector} from 'react-redux';
import rehypeRaw from 'rehype-raw';
import Social from '../../components/ActionBar/Social.jsx';
import Votes from '../../components/ActionBar/Votes.jsx';
import Toaster from '../../components/Toast/Toast.jsx';
import {selectSubredditComments, selectSubredditCommentsError, selectSubredditCommentsPostId, selectSubredditCommentsStatus} from '../../store/subredditCommentsSlice.js';
import {selectUserAvatars} from '../../store/subredditPostsSlice';
import formatPostText from '../../utils/formatPostText.js';
import formatPostMedia from '../../utils/formatPostMedia.js';
import validateAvatarImgURL from '../../utils/validateImgURL.js';
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import {getUserAvatar} from '../api/reddit';

function Post(props) {
  const {postId, postAuthor, postDate, postMedia, postImgSrc, postTitle, postText, postTextHtml, altText, postPermalink, score, numberOfComments, handleComments, collapseStates, setCollapseStates} = props;

  useEffect(() => {
    Holder.run({
      images: ".card-img-top"
    });
  }, []);

  const dispatch = useDispatch();
  const avatars = useSelector(selectUserAvatars);

  // get user avatar
  useEffect(() => {
    // console.log('dispatching', postAuthor);
    const promise = dispatch(getUserAvatar(postAuthor));
    return () => {
      promise.abort('Aborted from Post');
    }
  }, [dispatch, postAuthor]);

  const comments = useSelector(selectSubredditComments);
  const commentsStatus = useSelector(selectSubredditCommentsStatus);
  const commentsErrorState = useSelector(selectSubredditCommentsError);
  const commentsRequestedPostId = useSelector(selectSubredditCommentsPostId);
  const commentsDispatchedPost = postId === commentsRequestedPostId; // isolate the post that comments were requested for
  const commentsFailedPost = postId === commentsErrorState?.meta.arg.postId; // isolate the post that a comments request errored

  const handleCollapse = (postId) => {
    const updatedStates = {...collapseStates};
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
      handleComments({permalink: postPermalink, postId})
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
            <div id={`comments-wrapper-${postId}`} style={{border: '4px double green'}}>
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

  return (
    <>
      <Card id={postId}>
        {postImgSrc ? <Card.Img variant="top" src={postImgSrc} alt={altText} /> : null}
        <Card.Body>
          <Card.Title>{postTitle} <div style={{float: 'right'}}>id: {postId} show: {collapseStates[postId] ? 'true' : 'false'}</div></Card.Title>
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatars[postAuthor])} /> {postAuthor}
          <Card.Text as='div'>{/* Render as 'div' to avoid <pre> nesting; <pre> cannot appear as a descendant of <p>. */}
            <Container fluid className="p-0">

              {/* MOBILE POSTTEXT show on xs and sm screen size only */}
              <Row className='d-md-none'>
                <Markdown className="d-md-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 60) + '...show on xs sm only'}</Markdown>
              </Row>

              {/* MOBILE POSTMEDIA show on xs and sm screen size only */
                postMedia.content &&
                <Row className='d-md-none'>
                  {formatPostMedia(postMedia)}
                </Row>
              }

              {/* DESKTOP POSTMEDIA show on md and lg screen size only */
                postMedia.content &&
                <Row className='d-none d-md-block d-xl-none d-xxl-none'>
                  {formatPostMedia(postMedia)}
                </Row>
              }

              {/* DESKTOP POSTMEDIA show on xl and xxl screen size only */
                postMedia.content &&
                <Row className='d-none d-xl-block'>
                  {formatPostMedia(postMedia)}
                </Row>
              }

              <Row className='align-items-end'>

                {/* MOBILE ACTION BAR (left side) show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Votes stackGap={1} iconSize={'1.5em'} score={score} />
                </Col>

                {/* DESKTOP ACTION BAR (left side) show on md and larger */}
                <Col className="d-none d-md-block">
                  <Votes stackGap={2} iconSize={'3em'} score={score} badgeStyle={'position-absolute translate-middle-x'} />
                </Col>

                <Col xs sm={5} xl={7}>

                  {/* MOBILE DATE show on xs and sm screen size only */}
                  <div className="d-md-none date small" style={{border: 'solid 1px red'}}>{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP DATE show on md and lg screen size only */}
                  <div className="d-none d-md-block d-xl-none d-xxl-none date small" style={{border: 'solid 1px red'}}>{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP DATE show on xl and xxl screen size only */}
                  <div className="d-none d-xl-block date small" style={{border: 'solid 1px blue'}}>{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP POSTTEXT show on md and lg screen size only */}
                  <Markdown className="d-none d-md-block d-xl-none d-xxl-none" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 200) + '...show on md and lg only'}</Markdown>

                  {/* DESKTOP POSTTEXT show on xl and xxl screen size only */}
                  <Markdown className="d-none d-xl-block" rehypePlugins={[rehypeRaw]} >{formatPostText(postTextHtml, postText, 1200) + '...show on xl and xxl only'}</Markdown>

                </Col>

                {/* MOBILE ACTION BAR (right side) show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Social
                    stackGap={1}
                    comments={comments}
                    postId={postId}
                    collapseStates={collapseStates}
                    toggleComments={toggleComments}
                    numberOfComments={numberOfComments}
                  />
                </Col>

                {/* DESKTOP ACTION BAR (right side) show on md and larger */}
                <Col className='d-none d-md-block'>
                  <Social
                    iconSize="3em"
                    badgeStyle="position-absolute translate-middle-x"
                    stackGap={1}
                    comments={comments}
                    postId={postId}
                    collapseStates={collapseStates}
                    toggleComments={toggleComments}
                    numberOfComments={numberOfComments}
                  />
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
            onClick={() => handleComments({permalink: postPermalink, postId})}
          >Retry</Button>
        </Toaster> :
        null
      }
      {renderComments()}
    </>
  )
}

export default Post;
