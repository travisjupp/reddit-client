import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import Toaster from '../../components/Toast/Toast.jsx';
import {
  selectSubredditPostsError,
  selectSubredditPosts,
  selectSubredditPostsStatus,
  selectSubredditPostsCurrent,
} from '../../store/subredditPostsSlice.js';
import Post from '../Post/Post';
import { getSubredditComments, getSubredditPosts } from '../api/reddit';

function Main() {
  const [collapseStates, setCollapseStates] = useState({});
  const dispatch = useDispatch();
  const posts = useSelector(selectSubredditPosts);
  const postsCurrent = useSelector(selectSubredditPostsCurrent);
  const postsStatus = useSelector(selectSubredditPostsStatus);
  const postsErrorState = useSelector(selectSubredditPostsError);
  const handleComments = permalink => {
    dispatch(getSubredditComments(permalink));
  };

  useEffect(() => {
    dispatch(getSubredditPosts('popular'));
  }, [dispatch]);

  if (postsStatus === 'loading') {
    return <StatusLoader />;
  }

  if (postsStatus === 'succeeded') {
    return (
      <>
        <h1 id='srTitle'>
          <span>r/</span>
          <span>{postsCurrent}</span>
        </h1>

        {posts[postsCurrent].map((post, idx) => {
          return (
            <Post
              key={'post-' + post.data.id}
              postIdx={idx}
              postId={'post-' + post.data.id}
              postTitle={post.data.title}
              postAuthor={post.data.author}
              postDate={post.data.created}
              postMedia={{
                preview: post.data.preview, // Preview images, and image only posts
                mediaEmbed: post.data.media_embed, // Embedded videos (iframe)
                isRedditVideo: post.data.is_video, // Reddit hosted video flag
                redditVideo: post.data.media?.reddit_video, // Reddit hosted video
                isGallery: post.data.is_gallery, // Image galleries flag
                metadata: post.data.media_metadata, // Image gallery images
                data: post.data.gallery_data, // Image gallery ids
                altText: `r/${post.data.subreddit} - ${post.data.title}`, // Img alt text
              }}
              postText={post.data.selftext}
              postTextHtml={post.data.selftext_html}
              postUrl={post.data.url}
              postPermalink={post.data.permalink.slice(0, -1)}
              score={post.data.score}
              numberOfComments={post.data.num_comments}
              handleComments={handleComments}
              collapseStates={collapseStates}
              setCollapseStates={setCollapseStates}
              // postText={'#######LAYOUT####BREAKER####FOR####TESTING####LAYOUT##############################################################################################################################################################################################################################'}
              // postTextHtml={'#######LAYOUT####BREAKER####FOR####TESTING####LAYOUT##############################################################################################################################################################################################################################'}
            />
          );
        })}
      </>
    );
  }

  if (postsStatus === 'failed') {
    // let errorStr = JSON.stringify(postsErrorState);
    return (
      <>
        {/* Toaster */}
        <Toaster
          header={`Get Posts ${postsErrorState.message}`}
          variant='light'
        >
          {/* {console.error('postsErrorState', postsErrorState)} */}
          <pre>
            {postsErrorState.payload}
            <br />
            <br />
            <hr />
            <strong>{`${postsErrorState.type}`}</strong>
            <br />
            <br />
            {/* <pre>{errorStr}</pre> */}
          </pre>
          <Button
            className=''
            onClick={() => dispatch(getSubredditPosts(postsCurrent))}
          >
            Retry
          </Button>
        </Toaster>
      </>
    );
  }
}

export default Main;
