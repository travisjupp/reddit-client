import React, {useEffect} from 'react';
import {Accordion, Nav} from 'react-bootstrap';
import {getPopSubredditsList, getSubredditPosts} from '../api/reddit';
import {useDispatch, useSelector} from 'react-redux';
import {selectPopSubredditsList, selectPopSubredditsListError, selectPopSubredditsListStatus} from '../../store/subredditSlice';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import Avatar from '../Avatar/Avatar';

function Sidebar(props) {
    const {toggleOffcanvas} = props;
    const dispatch = useDispatch();
    const popSubredditsList = useSelector(selectPopSubredditsList);
    const status = useSelector(selectPopSubredditsListStatus);
    const popSubredditsListErrorState = useSelector(selectPopSubredditsListError);

    useEffect(() => {
        if (!popSubredditsList.length) { // check if popular subreddits are cached before dispatching fetch (avoid hitting rate-limits)
            console.log('dispatching getPopSubredditsList');
            dispatch(getPopSubredditsList());
        }
    }, [dispatch, popSubredditsList]);

    const handlePosts = (postTitle) => {
        dispatch(getSubredditPosts(postTitle));
    }

    while (status === 'loading') {
        return <StatusLoader />
    }

    if (status === 'failed') {
        console.error('ERROR', popSubredditsListErrorState)
        let errorStr = JSON.stringify(Object.entries(popSubredditsListErrorState));

        return (
            <>
                <code>{popSubredditsListErrorState.error.message}</code>
                <pre style={{whiteSpace: 'pre-wrap'}}>
                    {popSubredditsListErrorState.payload}<hr />
                    <code style={{wordBreak: 'break-word'}}>{errorStr}</code>
                </pre>
            </>


        )
    }

    if (status === 'succeeded') {
        return (
            <>
                <Accordion flush>
                    <Accordion.Item>
                        <Accordion.Header>Popular</Accordion.Header>
                        <Accordion.Body>
                            {
                                popSubredditsList.map(
                                    subreddit =>
                                        <Nav.Link
                                            key={subreddit.data.title}
                                            // href={`${apiRoot}${subredditListItem.url}`}
                                            href={`#`}
                                            onClick={() => {
                                                // setPostTitle(subreddit.data.display_name);
                                                handlePosts(subreddit.data.display_name);
                                                return toggleOffcanvas ? toggleOffcanvas() : null;
                                            }}>
                                            <Avatar name={subreddit.data.title} src={subreddit.data.icon_img} />
                                            {subreddit.data.title}
                                        </Nav.Link>
                                )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </>
        );
    }
}

export default Sidebar;

