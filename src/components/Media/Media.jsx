import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
import parse from 'html-react-parser';

// If post media exists, decode html-entites and render.
const Media = ({postMedia, postMediaPreview}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    try {
        if (typeof postMedia.content === 'string') {
            const postMediaDomElement = he.decode(postMedia.content);
            // => thumbnail media image component that opens a modal on click
            console.log('he.decode', he.decode(postMediaPreview.images[0].source.url))
            return (<> <img onClick={handleShow} src={he.decode(postMediaPreview.images[0].source.url)} alt="Media Preview" />
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        {/* <Modal.Title>Modal heading</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body className="row-cols-1">{parse(postMediaDomElement)}</Modal.Body>
                    {/* <Modal.Footer> */}
                    {/*     <Button variant="secondary" onClick={handleClose}> */}
                    {/*         Close */}
                    {/*     </Button> */}
                    {/*     <Button variant="primary" onClick={handleClose}> */}
                    {/*         Save Changes */}
                    {/*     </Button> */}
                    {/* </Modal.Footer> */}
                </Modal>
            </>)
            // return parse(postMediaDomElement); // return parsed DOM node
        } else {
            return;
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default Media;