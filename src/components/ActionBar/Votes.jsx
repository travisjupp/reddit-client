import React, {useState} from "react";
import {BsArrowDownCircle, BsArrowDownCircleFill, BsArrowUpCircle, BsArrowUpCircleFill} from "react-icons/bs";
import {Badge, Stack} from "react-bootstrap";

const Votes = (props) => {
  const {stackGap, iconSize = '1.5em', score, badgeStyle} = props;
  const [upIconHover, setUpIconHover] = useState(false);
  const [downIconHover, setDownIconHover] = useState(false);
  const upCircle = () => <BsArrowUpCircle size={iconSize} color='#000000' />;
  const upCircleFill = () => <BsArrowUpCircleFill size={iconSize} color='#000000' />;
  const downCircle = () => <BsArrowDownCircle size={iconSize} color='#000000' />;
  const downCircleFill = () => <BsArrowDownCircleFill size={iconSize} color='#000000' />;
  return (
    <>
      <Stack direction="horizontal" gap={stackGap} style={{}} className='justify-content-start'>
        <button aria-label="Up Vote" onMouseOver={() => setUpIconHover(true)} onMouseLeave={() => setUpIconHover(false)} href='#'>{upIconHover ? upCircleFill() : upCircle()}</button>
        <div style={{minWidth: "max-content"}}>
          <button aria-label="Down Vote" style={{paddingRight: ".25rem"}} onMouseOver={() => setDownIconHover(true)} onMouseLeave={() => setDownIconHover(false)} href='#'>{downIconHover ? downCircleFill() : downCircle()}</button>
          <Badge pill className={badgeStyle}>{score}</Badge>
        </div>
      </Stack>
    </>
  )
}

export default Votes;
