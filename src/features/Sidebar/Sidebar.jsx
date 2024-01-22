import React, { useEffect } from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { getPopSubredditsList } from '../api/reddit';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopSubreddits } from '../../store/subredditSlice';
import { selectPopSubredditTitles } from '../../store/subredditSlice';
import { apiRootTesting as apiRoot } from '../api/reddit';
import Avatar from '../Avatar/Avatar';

function Sidebar(props) {

    const dispatch = useDispatch();
    // const popSubreddits = useSelector(selectPopSubreddits);
    // console.log('popSubreddits', popSubreddits);
    const popSubredditTitles = useSelector(selectPopSubredditTitles);
    // console.log('popSubredditTitles', popSubredditTitles);
    useEffect(() => {
        dispatch(getPopSubredditsList());
    }, [dispatch]
    );
// CREATE CLICK HANDLER 
// DISPATCHES getSubredditPosts(subreddit.data.url)


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
                    {popSubredditTitles.map(
                            subredditListItem =>
                                <li key={subredditListItem.title}>
                                    <a href={`${apiRoot}${subredditListItem.url}`}>
                                        <Avatar name={Math.random()} src={subredditListItem.icon} />
                                        {/* <img src={subredditArrayElement[2]} width="25px" height="25px" /> */}
                                        {subredditListItem.title}
                                    </a>
                                </li>
                        )}

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default Sidebar;