import React, { useEffect } from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import { getPopSubredditsList, getSubredditPosts } from '../api/reddit';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopSubredditsList, selectSubredditsListStatus } from '../../store/subredditSlice';
import { apiRootTesting as apiRoot } from '../api/reddit';
import Avatar from '../Avatar/Avatar';

function Sidebar(props) {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPopSubredditsList());
    }, [dispatch]);

    const popSubredditsList = useSelector(selectPopSubredditsList);
    console.log('popSubredditsList', popSubredditsList);
    // const popSubredditTitles = useSelector(selectPopSubredditTitles);
    const status = useSelector(selectSubredditsListStatus);
    while (status !== 'succeeded') {
        return 'Subreddits Loading...'
    }
    // CREATE CLICK HANDLER 
    // DISPATCHES getSubredditPosts(subreddit.data.url)
    const handlePosts = (param) => {

        dispatch(getSubredditPosts(param));

    }

    return (
        <>
            {/* <Button href="#" size="lg">SidebarButton</Button> */}
            {/* <div className="d-grid gap-1">
                <DropdownButton id="dropdown-basic-button" title="Button" size="lg">
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </DropdownButton>
            </div> */}
            <Accordion flush>
                <Accordion.Item>
                    <Accordion.Header>Popular</Accordion.Header>
                    <Accordion.Body>
                        {popSubredditsList.map(
                            subredditListItem =>

                                    <Nav.Link
                                    key={subredditListItem.data.title}
                                        // href={`${apiRoot}${subredditListItem.url}`}
                                        href={`#`}
                                        onClick={() => { handlePosts(subredditListItem.data.display_name) }}>
                                        <Avatar name={Math.random()} src={subredditListItem.data.icon_img} />
                                        {subredditListItem.data.title}
                                    </Nav.Link>

                                
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default Sidebar;