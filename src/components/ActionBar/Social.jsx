import React, {useState} from "react";
import {BsChatQuote, BsChatQuoteFill, BsShare, BsShareFill} from "react-icons/bs";
import {Badge, Stack} from "react-bootstrap";

const Social= (props) => {
  const {stackGap, iconSize = '1.5em', comments, postId, collapseStates, toggleComments, numberOfComments, badgeStyle} = props;
  const [shareIconHover, setShareIconHover] = useState(false);
  const [chatIconHover, setChatIconHover] = useState(false);
  const shareIcon = () => <BsShare size={iconSize} color='#000000' />;
  const shareIconFill = () => <BsShareFill size={iconSize} color='#000000' />;
  const chatIcon = () => <BsChatQuote size={iconSize} color='#000000' />;
  const chatIconFill = () => <BsChatQuoteFill size={iconSize} color='#000000' />;
  return (
    <>
      <Stack direction="horizontal" gap={stackGap} style={{}} className='justify-content-end'>
        <button onMouseOver={() => setShareIconHover(true)} onMouseLeave={() => setShareIconHover(false)} href='#'>{upIconHover ? shareIconFill() : shareIcon()}</button>
        <div className="vr" height="5px"></div>

        <div style={{minWidth: "max-content"}}>
          <button
            style={{}}
            onMouseOver={() => setChatIconHover(true)}
            onMouseLeave={() => setChatIconHover(false)}
            href='#'
            aria-controls={`comments-wrapper-${postId}`}
            aria-expanded={collapseStates[postId]}
            onClick={toggleComments}
            id={`button-${postId}`}
          >{chatIconHover ? chatIconFill() : chatIcon()}</button>
          <Badge pill className={badgeStyle}>{/* Overlay actual number of comments when comments clicked/loaded. `numberOfComments` not accurate, but good enough on initial load. */}
{comments.length !== 0 && comments[0].data.parent_id === `t3_${postId}` ? comments.length : numberOfComments}</Badge>
        </div>
      </Stack>
    </>
  )
}

export default Social;
