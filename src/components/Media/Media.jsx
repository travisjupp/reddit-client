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
    const {mediaEmbed, preview, isGallery, metadata, data, altText} = postMedia;
    console.log('~>postMedia', postMedia);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const previewResolutions = preview?.images[0].resolutions || [];
    const sortedPreviewResolutions = [...previewResolutions].sort((a, b) => b.width - a.width); // sort for DOM
    const previewId = preview?.images[0].id; // get preview id
    const previewSource = preview?.images[0].source; // get preview source
    const postMediaDomElement = he.decode(mediaEmbed.content || ''); // embedded iframes
    console.log('~>preview', preview, '\n~~>previewResolutions', previewResolutions, '\n~~>sortedPreviewResolutions', sortedPreviewResolutions, '\n~~>mediaEmbed', mediaEmbed, '\n~>isGallery', isGallery, '\n~~>metadata', metadata, '\n~~>data', data);
    try {
        // PREVIEW CHECKER check for previews, or image only posts
        if (preview) {
            // return picture with source elements
            return (
                <picture id={previewId} style={{padding: 0}}>
                    {
                        // build srcset from `preview.images[0].resolutions`
                        sortedPreviewResolutions.map(image => {
                            return (
                                <source
                                    key={previewId + '@' + image.width}
                                    srcSet={he.decode(image.url)}
                                    media={`(min-width: ${image.width}px)`}
                                //width={image.width}
                                //height={image.height}
                                />
                            )
                        })
                    }
                    { // MEDIA CHECKER check for embedded media (iframe DOM elements) 
                        // media preview image opens media source in modal on click
                        typeof mediaEmbed.content === 'string' ?
                            <>
                                <img onClick={handleShow} src={he.decode(previewSource.url)}
                                    // width={previewSource.width}
                                    // height={previewSource.height}
                                    className="card-img-top"
                                    alt={altText}
                                    // style={{width: "inherit"}}
                                />
                                <Modal show={show} onHide={handleClose} centered>
                                    <Modal.Header closeButton>
                                        {/* <Modal.Title>Modal heading</Modal.Title> */}
                                    </Modal.Header>
                                    <Modal.Body className="row-cols-1">{parse(postMediaDomElement)}</Modal.Body>
                                </Modal>
                            </> :
                            // if post media is not DOM element render image
                            <img src={he.decode(previewSource.url)}
                                // width={previewSource.width}
                                // height={previewSource.height}
                                className="card-img-top"
                                alt={altText}
                                // style={{width: "inherit"}}
                            />
                    }
                </picture>
            )
        }
        // GALLERY CHECKER check for image galleries
        if (isGallery) {
            for (const key in metadata) {
                console.log('~>image', metadata[key]);
                // let image = metadata[key];

                console.log('~>metadata[key][]',)

                for (const imgKey in metadata[key]) {
                    console.log('~>imgKey', imgKey, '=>', metadata[key][imgKey])
                }
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default Media;
