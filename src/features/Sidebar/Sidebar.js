import React from 'react';
import { Accordion, AccordionButton, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { getSubredditTitles } from '../../api/reddit';

getSubredditTitles();
function Sidebar(props) {
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


                        Body</Accordion.Body>

                </Accordion.Item>
            </Accordion>
        </>
    );
}

export default Sidebar;