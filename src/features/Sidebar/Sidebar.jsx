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
        dispatch(getPopSubredditsList());
    }, [dispatch]);

    const handlePosts = (postTitle) => {
        dispatch(getSubredditPosts(postTitle));
        window.scrollTo(0, 0);
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
                        <Accordion.Header>Popular Subreddits</Accordion.Header>
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
                                            <Avatar name={subreddit.data.title} src={subreddit.data.icon_img} size="30" />
                                            <span id="prefix">r/</span><span id="srlink">{subreddit.data.url.slice(3,-1)}</span>
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

