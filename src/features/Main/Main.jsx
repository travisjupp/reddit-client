import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRoot, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { selectSubredditPosts, selectSubredditPostsStatus } from '../../store/subredditPostsSlice.js';

function Main(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts('react'));
    }, [dispatch]);


    const posts = useSelector(selectSubredditPosts);
    const status = useSelector(selectSubredditPostsStatus);
    console.log('posts', posts);
    // console.log('posts[0]',posts[0]);
    console.log('status', status);
    while (status !== 'succeeded') {
        return <StatusLoader />
    }
    const validatePostImgURL = (url) => {
        return url.match(/jpeg|jpg|png/i) ? url : null;
    }

    return (
        <>
            <h1>r/{posts[0].data.subreddit}</h1>

            {posts.map(post => {
                return <Post
                    key={post.data.id}
                    postTitle={post.data.title}
                    postImgSrc={validatePostImgURL(post.data.url)}
                    postText={post.data.selftext}
                    altText={`r/${post.data.subreddit} - ${post.data.title}`}
                // postText={'#####################################################################################################################################################################################################################################################'}
                />
            })}
        </>
    )
}

export default Main;