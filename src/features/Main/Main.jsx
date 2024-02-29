import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRoot, getSubredditComments, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectSubredditPosts, selectSubredditPostsStatus, selectSubredditPostsError } from '../../store/subredditPostsSlice.js';

function Main(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts('react'));
    }, [dispatch]);

    
    const posts = useSelector(selectSubredditPosts);
    const status = useSelector(selectSubredditPostsStatus);
    const subredditPostsErrorState = useSelector(selectSubredditPostsError);
    
    // console.log('posts', posts);
    // console.log('posts[0]',posts[0]);
    // console.log('status', status);
    
    useEffect(() => {
        dispatch(getSubredditComments('/r/MapPorn/comments/1aio2ky/ww1_western_front_every_day'));
    }, [dispatch]);

    while (status === 'loading') {
        return <StatusLoader />
    }

    if (status === 'failed') {
        { console.log('ERROR', subredditPostsErrorState) }
        let errorStr = JSON.stringify(Object.entries(subredditPostsErrorState));
        return (
            <>
                <code>{subredditPostsErrorState.error.message}</code>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {subredditPostsErrorState.payload}<hr />
                    <code style={{ wordBreak: 'break-word' }}>{errorStr}</code>
                </pre>
            </>
        )
    }

    if (status === 'succeeded') {
        const validatePostImgURL = (url) => {
            if (!url) {
                return
            }
            return url.match(/jpeg|jpg|png/i) ? url : null;
        }
        return (
            <>
                <h1>r/{posts[0].data.subreddit}</h1>

                {posts.map(post => {
                    
                    return <Post
                        key={post.data.id}
                        postTitle={post.data.title}
                        postAuthor={post.data.author}
                        postImgSrc={validatePostImgURL(post.data.url)}
                        postText={(post.data.selftext).substring(0, 200)+'...'}
                        altText={`r/${post.data.subreddit} - ${post.data.title}`}
                        postPermalink={post.data.permalink}
                    // postText={'#####################################################################################################################################################################################################################################################'}
                    />
                })}
            </>
        )
    }

}

export default Main;