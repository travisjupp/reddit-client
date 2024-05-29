import React, { useEffect, useState } from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import { getPopSubredditsList, getSubredditPosts } from '../api/reddit';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopSubredditsList, selectPopSubredditsListError, selectPopSubredditsListStatus } from '../../store/subredditSlice';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { apiRootTesting as apiRoot } from '../api/reddit';
import Avatar from '../Avatar/Avatar';
import { selectSubredditPosts } from '../../store/subredditPostsSlice';

function Sidebar(props) {
    const { toggleOffcanvas, show } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPopSubredditsList());
    }, [dispatch]);

    const popSubredditsList = useSelector(selectPopSubredditsList);
    const status = useSelector(selectPopSubredditsListStatus);
    const popSubredditsListErrorState = useSelector(selectPopSubredditsListError);

    const posts = useSelector(selectSubredditPosts);
    const [postTitle, setPostTitle] = useState('Home');

    useEffect(() => {
        if (posts[0]?.data.subreddit !== postTitle) { // check if posts are cached before dispatching fetch (avoid hitting rate-limits)
            dispatch(getSubredditPosts(postTitle));
        }
    }, [dispatch, postTitle]);

    while (status === 'loading') {
        return <StatusLoader />
    }

    if (status === 'failed') {
        { console.log('ERROR', popSubredditsListErrorState) }
        let errorStr = JSON.stringify(Object.entries(popSubredditsListErrorState));

        return (
            <>
                <code>{popSubredditsListErrorState.error.message}</code>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {popSubredditsListErrorState.payload}<hr />
                    <code style={{ wordBreak: 'break-word' }}>{errorStr}</code>
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
                                                setPostTitle(subreddit.data.display_name);
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