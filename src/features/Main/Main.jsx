import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubredditComments, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectSubredditPosts, selectSubredditPostsStatus, selectSubredditPostsError } from '../../store/subredditPostsSlice.js';
import validatePostImgURL from '../../utils/validateImgURL.js'
import Toaster from '../../components/Toast/Toast.jsx';
import { Button } from 'react-bootstrap';

function Main(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts('x'));
    }, [dispatch]);

    const posts = useSelector(selectSubredditPosts);
    const postsStatus = useSelector(selectSubredditPostsStatus);
    const postsErrorState = useSelector(selectSubredditPostsError);

    const handleComments = (permalink) => {
        dispatch(getSubredditComments(permalink));
        // dispatch(getSubredditComments('TEST ERROR'));
    }

    while (postsStatus === 'loading') {
        return <StatusLoader />
    }



    if (postsStatus === 'succeeded') {

        return (
            <>
                <h1>r/{posts[0].data.subreddit}</h1>

                {posts.map(post => {


                    return <Post
                        key={post.data.id}
                        postId={post.data.id}
                        postTitle={post.data.title}
                        postAuthor={post.data.author}
                        postImgSrc={validatePostImgURL(post.data.url)}
                        postText={post.data.selftext}
                        postTextHtml={post.data.selftext_html}
                        altText={`r/${post.data.subreddit} - ${post.data.title}`}
                        postPermalink={post.data.permalink.slice(0, -1)}
                        numberOfComments={post.data.num_comments}
                        handleComments={handleComments}
                    // postText={'#####################################################################################################################################################################################################################################################'}
                    />
                })}
            </>
        )
    }

    if (postsStatus === 'failed') {
        let errorStr = JSON.stringify(postsErrorState);
        return (
            <>
                {/* <code>{postsErrorState.error.message}</code>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {postsErrorState.payload}<hr />
                    <code style={{ wordBreak: 'break-word' }}>{errorStr}</code>
                </pre> */}
                {/* Toaster */}
                <Toaster header={`Get Posts ${postsErrorState.message}`} variant='dark'>
                    {/* {console.error('postsErrorState', postsErrorState)} */}
                    <pre>
                        {postsErrorState.payload}<br />
                        <hr />
                        <strong>{`${postsErrorState.type}`}</strong>
                        {/* <code>{errorStr}</code> */}
                    </pre>
                    <Button className='' onClick={() => dispatch(getSubredditPosts('react'))}>Retry</Button>
                </Toaster>

            </>
        )
    }

}

export default Main;