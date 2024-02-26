import React, { useEffect } from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import { getPopSubredditsList, getSubredditPosts } from '../api/reddit';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopSubredditsList, selectPopSubredditsListError, selectPopSubredditsListStatus } from '../../store/subredditSlice';
import StatusLoader from '../../components/StatusLoader/StatusLoader';
import { apiRootTesting as apiRoot } from '../api/reddit';
import Avatar from '../Avatar/Avatar';

function Sidebar(props) {
    const { toggleOffcanvas, show } = props;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPopSubredditsList());
    }, [dispatch]);

    const popSubredditsList = useSelector(selectPopSubredditsList);
    const status = useSelector(selectPopSubredditsListStatus);
    const popSubredditsListErrorState = useSelector(selectPopSubredditsListError);

    const handlePosts = (param) => {
        dispatch(getSubredditPosts(param));
        console.log('Sidebar.jsx typeof toggleOffcanvas', typeof toggleOffcanvas)
    }

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
                                    subredditListItem =>

                                        <Nav.Link
                                            key={subredditListItem.data.title}
                                            // href={`${apiRoot}${subredditListItem.url}`}
                                            href={`#`}
                                            onClick={() => {
                                                handlePosts(subredditListItem.data.display_name);
                                                return toggleOffcanvas ? toggleOffcanvas() : null;
                                            }
                                            }

                                        >

                                            <Avatar name={subredditListItem.data.title} src={subredditListItem.data.icon_img} />
                                            {subredditListItem.data.title}
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