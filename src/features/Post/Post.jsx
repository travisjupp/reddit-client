import {DateTime} from 'luxon';
import he from 'he';
import React, {useEffect, useState} from 'react';
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
import validateAvatarImgURL from '../../utils/validateImgURL.js';
import Avatar from "../Avatar/Avatar";
import Comment from "../Comment/Comment";
import {getUserAvatar} from '../api/reddit';
import Media from '../../components/Media/Media.jsx';
function Post(props) {
  const {postId, postAuthor, postDate, postMedia, postTitle, postText, postTextHtml, postUrl, postPermalink, score, numberOfComments, handleComments, collapseStates, setCollapseStates} = props;

  const dispatch = useDispatch();
  const avatars = useSelector(selectUserAvatars);

  // get user avatar
  useEffect(() => {
    const promise = dispatch(getUserAvatar(postAuthor));
    return () => {
      promise.abort();
    }
  }, [dispatch, postAuthor]);

  const comments = useSelector(selectSubredditComments);
  const commentsStatus = useSelector(selectSubredditCommentsStatus);
  const commentsErrorState = useSelector(selectSubredditCommentsError);
  const commentsRequestedPostId = useSelector(selectSubredditCommentsPostId);
  const commentsDispatchedPost = postId === commentsRequestedPostId; // isolate the post that comments were requested for
  const commentsFailedPost = postId === commentsErrorState?.meta.arg.postId; // isolate the post that a comments request errored

  const nonRedditPostUrlLink = postUrl.search(/(www\.reddit\.com)|(redd\.it)/g) === -1 && <a href={postUrl} className='ps-0 pe-0 pb-3'>{postUrl}</a>;

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
            <div id={`comments-wrapper-${postId}`} className="comments-wrapper">
              {comments.map(comment => {
                return <Comment
                  key={comment.data.id}
                  commentAuthor={comment.data.author}
                  commentDate={comment.data.created}
                  commentText={comment.data.body}
                  commentTextHtml={comment.data.body_html}
                />
              })}
            </div>
          </Collapse>
        }
      </>)
  }

  const [cardStyle, setCardStyle] = useState('auto');

  const [open, setOpen] = useState(false);
  return (
    <>
      <Card id={postId}
        // style={{height: document.getElementById(postId)?.offsetHeight || 'auto', transitionDuration: '1s'}}
        style={{cardStyle, transitionDuration: '1s'}}
      // style={{height: document.getElementById(postId)?.querySelector('.active.carousel-item img')?.height || 'auto', transitionDuration: '1s'}}
      >
        {/* POST MEDIA */
          (postMedia.mediaEmbed?.content || typeof postMedia.preview === 'object' || postMedia.isGallery || postMedia.isRedditVideo) &&
          <Media
            postMedia={postMedia}
            postId={postId}
            cardStyle={cardStyle}
            setCardStyle={setCardStyle}
          />
        }
        <Card.Body
          /* remove top border radius if Media component is used (card-img-top) */
          style={postMedia.mediaEmbed?.content || typeof postMedia.preview === 'object' || postMedia.isGallery || postMedia.isRedditVideo ? {borderTopLeftRadius: 0, borderTopRightRadius: 0} : null}>
          <Card.Title>{he.decode(postTitle)}</Card.Title>
          <Avatar name={postAuthor} src={validateAvatarImgURL(avatars[postAuthor])} /> {postAuthor}
          <Card.Text as='div' className="pt-3">{/* Render as 'div' to avoid <pre> nesting; <pre> cannot appear as a descendant of <p>. */}
            <Container fluid className="p-0">

              {/* MOBILE POSTTEXT show on xs and sm screen size only */
                (postTextHtml || postText) &&
                <div onClick={() => setOpen(!open)}
                  className="post-text-wrapper d-md-none"
                  aria-controls={"post-text" + postId} aria-expanded={open} role="button">
                  <div className="post-text-overlay" style={open ? {backgroundImage: 'none'} : null}></div>
                  <Collapse in={open}>
                    <div className='row post-text' id={"post-text" + postId}>
                      <Markdown className="d-md-none pt-0 pb-3" rehypePlugins={[rehypeRaw]}>{formatPostText(postTextHtml) || postText}</Markdown>
                      {nonRedditPostUrlLink}
                    </div >
                  </Collapse>
                </div>
              }
              <Row className='align-items-end'>
                <Col xs={12}>

                  {/* MOBILE DATE show on xs and sm screen size only */}
                  <div className="d-md-none date small">{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP DATE show on md and lg screen size only */}
                  <div className="d-none d-md-block d-xl-none d-xxl-none date small">{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP DATE show on xl and xxl screen size only */}
                  <div className="d-none d-xl-block date small">{DateTime.fromSeconds(postDate).toRelative()}</div>

                  {/* DESKTOP POSTTEXT show on md and lg screen size only */
                    (postTextHtml || postText) &&
                    <div onClick={() => setOpen(!open)}
                      className="post-text-wrapper d-none d-md-block d-xl-none d-xxl-none"
                      aria-controls={"post-text" + postId} aria-expanded={open} role="button">
                      <div className="post-text-overlay" style={open ? {backgroundImage: 'none'} : null}></div>
                      <Collapse in={open}>
                        <div className="pb-3 post-text" id={"post-text" + postId}>
                          <Markdown className="pt-0 pb-0" rehypePlugins={[rehypeRaw]}>{formatPostText(postTextHtml) || postText}</Markdown>
                          {nonRedditPostUrlLink}
                        </div>
                      </Collapse>
                    </div>
                  }

                  {/* DESKTOP POSTTEXT show on xl and xxl screen size only */
                    (postTextHtml || postText) &&
                    <div onClick={() => setOpen(!open)}
                      className="post-text-wrapper d-none d-xl-block"
                      aria-controls={"post-text" + postId} aria-expanded={open} role="button">
                      <div className="post-text-overlay" style={open ? {backgroundImage: 'none'} : null}></div>
                      <Collapse in={open}>
                        <div className="pb-3 post-text" id={"post-text" + postId}>
                          <Markdown className="ps-0 pe-0 pt-0 pb-0" rehypePlugins={[rehypeRaw]}>{formatPostText(postTextHtml) || postText}</Markdown>
                          {nonRedditPostUrlLink}
                        </div>
                      </Collapse>
                    </div>
                  }
                </Col>

                {/* MOBILE ACTION BAR (left side) show on xs and sm screen size only */}
                <Col className="d-md-none">
                  <Votes stackGap={1} iconSize='1.5em' score={score} />
                </Col>

                {/* DESKTOP ACTION BAR (left side) show on md and larger */}
                <Col className="d-none d-md-block">
                  <Votes stackGap={2} iconSize='2.5em' score={score} badgeStyle={'position-absolute translate-middle-x'} />
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
                <Col className="d-none d-md-block">
                  <Social
                    iconSize="2.5em"
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
            <pre style={{float: 'right', fontSize: '60%', margin: 0}}>id: {postId} show: {collapseStates[postId] ? 'true' : 'false'}</pre>
          </Card.Text>
        </Card.Body>
        {/* Make Card a hyperlink, all other links contained in card need a higher z-index */}
        {/* <a href={postPermalink} className='stretched-link' /> */}
      </Card>

      {/* Render Comments */}

      {/* If fetching comments failed pop toast only for the post for which it was originally requested */}
      {commentsStatus === 'failed' && commentsFailedPost ?
        <Toaster header={`Get Comments ${commentsErrorState.message}`} variant='light'>
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
