import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import Toaster from '../../components/Toast/Toast.jsx';
import {selectSubredditPostsError, selectSubredditPosts, selectSubredditPostsStatus} from '../../store/subredditPostsSlice.js';
// import validatePostImgURL from '../../utils/validateImgURL.js';
import Post from '../Post/Post';
import {getSubredditComments, getSubredditPosts} from '../api/reddit';

function Main() {
    const [collapseStates, setCollapseStates] = useState({});
    const dispatch = useDispatch();
    const posts = useSelector(selectSubredditPosts);
    const postsStatus = useSelector(selectSubredditPostsStatus);
    const postsErrorState = useSelector(selectSubredditPostsError);
    const handleComments = (permalink) => {
        dispatch(getSubredditComments(permalink));
    }

    useEffect(() => {
        dispatch(getSubredditPosts('react'));
    }, [dispatch]);

    if (postsStatus === 'loading') {
        return <StatusLoader />
    }

    if (postsStatus === 'succeeded') {

        return (
            <>
                <h1>r/{posts.current}</h1>

                {posts[posts.current].map(post => {
                    return <Post
                        key={post.data.id}
                        postId={post.data.id}
                        postTitle={post.data.title}
                        postAuthor={post.data.author}
                        postDate={post.data.created}
                        // postImgSrc={validatePostImgURL(post.data.url)}
                        postMedia={{
                            preview: post.data.preview, // preview images, and image only posts
                            mediaEmbed: post.data.media_embed, // embedded videos (iframe)
                            redditVideo: post.data.media?.reddit_video, // reddit hosted video
                            isGallery: post.data.is_gallery, // image galleries flag
                            metadata: post.data.media_metadata, // image gallery images
                            data: post.data.gallery_data, // image gallery ids
                            altText: `r/${post.data.subreddit} - ${post.data.title}`, // img alt text
                        }}
                        postText={post.data.selftext}
                        postTextHtml={post.data.selftext_html}
                        postUrl={post.data.url}
                        score={post.data.score}
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
