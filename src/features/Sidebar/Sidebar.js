import React, { useEffect } from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { getSubredditTitles } from '../api/reddit';
import { useDispatch, useSelector } from 'react-redux';
import { selectSubredditTitles } from '../../store/subredditSlice';
import { apiRoot } from '../api/reddit';

// WRITE SELECTOR FOR SELECTING SUBREDDIT TITLES FROM STORE (selectSubredditTitles)
// THEN SELECT FROM HERE TO RENDER

// getSubredditTitles();
function Sidebar(props) {

    const dispatch = useDispatch();
    const subredditTitles = useSelector(selectSubredditTitles);
    console.log('subredditTitles', subredditTitles)
    useEffect(() => {
        dispatch(getSubredditTitles());
    }, [dispatch]
    )
    // console.log('props',props)
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
                        {subredditTitles.map(
                            subredditArrayElement => 
                                <li>
                                    <a href={`${apiRoot}${subredditArrayElement[1]}`}>
                                        {subredditArrayElement[0]}
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