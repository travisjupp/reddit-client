import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRoot, getSubredditPosts } from '../api/reddit';
import Post from '../Post/Post.jsx';
import { selectSubredditPosts } from '../../store/subredditSlice.js';


function Main(props) {
    const dispatch = useDispatch();
    const posts = useSelector(selectSubredditPosts);
    useEffect(() => {
          dispatch(getSubredditPosts('Home'));
      }, [dispatch]
      )
    console.log('posts',posts);
    return (
        <>
            {/* MAP POSTS ARRAY FOR SELECTED SUBREDDIT TO RENDER POST COMPONENTS */}
            {/* HANDLE THIS SECTION WITH NEW MAIN.JSX COMPONENT THAT RENDERS POSTS */}

            <Post postTitle={'Map Partition'} postImgSrc={'https://i.redd.it/dcjc97hi3mcc1.jpeg'} />

        </>
    )
}


export default Main;