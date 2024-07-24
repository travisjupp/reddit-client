import React, {useState} from "react";
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
import parse from 'html-react-parser';

// If post media exists, decode html-entites and render.
// Searches for available media types: image galleries, images, and embedded media from 3rd party sites eg. twitch/youtube videos
const Media = ({postMedia}) => {
    const {mediaEmbed, preview, isGallery, metadata, data} = postMedia;
    console.log('~>postMedia', postMedia);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    try {
        // check for image only
        if (preview) {
            // get preview resolutions
            const resolutions = preview.images[0].resolutions;
            // sort resolutions so browser doesn't 
            // load lowest `<source width..` media query first
            const sortedResolutions = [...resolutions].sort((a, b) => b.width - a.width);
            const previewId = preview.images[0].id; // get preview id
            const previewSource = preview.images[0].source; // get preview source
            console.log('~>preview', preview, '\n~>isGallery', isGallery,
                '\n~>resolutions', resolutions, '\n~>sortedResolutions', sortedResolutions);

            return <picture key={previewId} id={previewId}>
                {sortedResolutions.map(image => {
                    return (
                        <source
                            srcset={he.decode(image.url)}
                            media={`(min-width: ${image.width}px)`}
                            width={image.width}
                            height={image.height}
                        />
                    )
                })
                }
                <img src={he.decode(previewSource.url)}
                    width={previewSource.width}
                    height={previewSource.height} alt="Post Media" />
            </picture>
        }
        // check for embedded media
        console.log('mediaEmbed.content', mediaEmbed.content);
        if (typeof mediaEmbed.content === 'string') {
            const postMediaDomElement = he.decode(mediaEmbed.content);
            // => media preview image opens media source in modal on click
            // build srcset from `preview.images[0].resolutions`
            let resolutions = preview.images[0].resolutions;
            console.log('~>resolutions', resolutions);

            return (
                <>
                    <img onClick={handleShow} src={he.decode(preview.images[0].source.url)} alt="Media Preview" />
                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            {/* <Modal.Title>Modal heading</Modal.Title> */}
                        </Modal.Header>
                        <Modal.Body className="row-cols-1">{parse(postMediaDomElement)}</Modal.Body>
                    </Modal>
                </>
            )
            // return parse(postMediaDomElement); // return parsed DOM node
        } else {
            // check for gallery
            if (isGallery) {
                console.log('~>isGallery', isGallery, '\nmetadata', metadata, '\ndata', data);
                for (const key in metadata) {
                    console.log('~>image', metadata[key]);
                    // let image = metadata[key];

                    console.log('~>metadata[key][]',)

                    for (const imgKey in metadata[key]) {
                        console.log('~>imgKey', imgKey, '=>', metadata[key][imgKey])
                    }
                }
            }
            return;
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default Media;
