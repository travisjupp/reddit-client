import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubredditComments, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectSubredditPosts, selectSubredditPostsStatus, selectSubredditPostsError } from '../../store/subredditPostsSlice.js';
import validatePostImgURL from '../../utils/validateImgURL.js'
import Toaster from '../../components/Toast/Toast.jsx';
import { Button } from 'react-bootstrap';

function Main(props) {

    const [collapseStates, setCollapseStates] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getSubredditPosts('INTENTIONALLY ERROR THIS OUT FOR TESTING'));
        dispatch(getSubredditPosts('Home'));
    }, [dispatch]);

    const posts = useSelector(selectSubredditPosts);
    const postsStatus = useSelector(selectSubredditPostsStatus);
    const postsErrorState = useSelector(selectSubredditPostsError);

    const handleComments = (permalink) => {
        dispatch(getSubredditComments(permalink));
        // dispatch(getSubredditComments('TEST ERROR'));
    }

    if (postsStatus === 'loading') {
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
                        postDate={post.data.created}
                        postImgSrc={validatePostImgURL(post.data.url)}
                        postText={post.data.selftext}
                        postTextHtml={post.data.selftext_html}
                        score={post.data.score}
                        altText={`r/${post.data.subreddit} - ${post.data.title}`}
                        postPermalink={post.data.permalink.slice(0, -1)}
                        numberOfComments={post.data.num_comments}
                        handleComments={handleComments}
                        collapseStates={collapseStates}
                        setCollapseStates={setCollapseStates}
                    // postText={'#######LAYOUT####BREAKER##########################################################################################################################################################################################################################################'}
                    // postTextHtml={'#######LAYOUT####BREAKER##########################################################################################################################################################################################################################################'}
                    />
                })}
            </>
        )
    }

    if (postsStatus === 'failed') {
        // let errorStr = JSON.stringify(postsErrorState);
        return (
            <>
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