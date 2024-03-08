import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRoot, getSubredditComments, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectSubredditPosts, selectSubredditPostsStatus, selectSubredditPostsError } from '../../store/subredditPostsSlice.js';
import { selectSubredditComments } from '../../store/subredditCommentsSlice.js';
import validatePostImgURL from '../../utils/validateImgURL.js'

function Main(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts('react'));
    }, [dispatch]);

    const posts = useSelector(selectSubredditPosts);
    const postsStatus = useSelector(selectSubredditPostsStatus);
    const postsErrorState = useSelector(selectSubredditPostsError);

    const handleComments = (permalink) => {
        console.log('permalink', permalink)
            dispatch(getSubredditComments(permalink));
      }

    while (postsStatus === 'loading') {
        return <StatusLoader />
    }

    if (postsStatus === 'failed') {
        { console.log('ERROR', postsErrorState) }
        let errorStr = JSON.stringify(Object.entries(postsErrorState));
        return (
            <>
                <code>{postsErrorState.error.message}</code>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {postsErrorState.payload}<hr />
                    <code style={{ wordBreak: 'break-word' }}>{errorStr}</code>
                </pre>
            </>
        )
    }

    if (postsStatus === 'succeeded') {

        return (
            <>
                <h1>r/{posts[0].data.subreddit}</h1>

                {posts.map(post => {


                    return <Post
                        key={post.data.id}
                        id={post.data.id}
                        postTitle={post.data.title}
                        postAuthor={post.data.author}
                        postImgSrc={validatePostImgURL(post.data.url)}
                        postText={post.data.selftext}
                        altText={`r/${post.data.subreddit} - ${post.data.title}`}
                        postPermalink={post.data.permalink.slice(0,-1)}
                        numberOfComments={post.data.num_comments}
                        handleComments={handleComments}
                    // postText={'#####################################################################################################################################################################################################################################################'}
                    />
                })}
            </>
        )
    }

}

export default Main;