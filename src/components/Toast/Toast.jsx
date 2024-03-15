import Toast from 'react-bootstrap/Toast';
import React, { useState } from 'react';
import { ToastContainer } from 'react-bootstrap';

function Toaster({children, header, variant}) {
    const [show, setShow] = useState(true);
    const toggleShow = () => setShow(!show);
  return (
    <ToastContainer position="bottom-end">
    <Toast show={show} onClose={toggleShow} bg={variant}>
      <Toast.Header>
        <strong className="me-auto">{header}</strong>
        {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
        <strong className="me-auto">Bootstrap</strong>
        <small>11 mins ago</small> */}
      </Toast.Header>
      <Toast.Body className={`d-flex flex-column ${variant === 'dark' ? 'text-white' : null}`}>{children}</Toast.Body>
    </Toast>
    </ToastContainer>
  );
}

export default Toaster;