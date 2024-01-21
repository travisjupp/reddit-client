import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRoot, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post.jsx';
import { selectSubredditPosts } from '../../store/subredditPostsSlice.js';


function Main(props) {
    const dispatch = useDispatch();
    const posts = useSelector(selectSubredditPosts);
    useEffect(() => {
          dispatch(getSubredditPosts('home'));
      }, [dispatch]
      )
    console.log('posts',posts);
    return (
        <>
            {posts.map(post => {
                return <Post key={post.data.id} postTitle={post.data.title} postImgSrc={post.data.url} postText={post.data.selftext} />

            })}
            
        </>
    )
}

export default Main;