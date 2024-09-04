import React, {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Carousel from "react-bootstrap/Carousel";
import VideoPlayer from "../../features/VideoPlayer/VideoPlayer";
// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
import parse from 'html-react-parser';
// If post media exists, decode html-entites and render.
// Searches for available media types: image galleries, images, reddit-hosted video, and embedded media from 3rd party sites eg. twitch/youtube videos
const Media = ({postMedia, postId}) => {
    const {mediaEmbed, preview, isGallery, metadata, altText, redditVideo} = postMedia;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const previewResolutions = preview?.images[0].resolutions || [];
    const sortedPreviewResolutions = [...previewResolutions].sort((a, b) => b.width - a.width); // sort for DOM (largest image first)
    const previewId = preview?.images[0].id; // get preview id
    const previewSource = preview?.images[0].source; // get preview source
    const postMediaDomElement = he.decode(mediaEmbed.content || ''); // embedded iframes
    const redditVideoURL = he.decode(redditVideo?.dash_url || '');

    try {
        // REDDIT VIDEO CHECKER check for reddit hosted video (MPEG-DASH)
        if (redditVideoURL) {
            return (
                <VideoPlayer redditVideoURL={redditVideoURL} postId={postId} />
            )
        }
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
                                width={image.width}
                                height={image.height}
                                />
                            )
                        })
                    }
                    { // MEDIA CHECKER check for embedded media (iframe DOM elements) 
                        // media preview image opens media source in modal on click
                        typeof mediaEmbed.content === 'string' ?
                            <>
                                <img onClick={handleShow} src={he.decode(previewSource.url)}
                                    width={previewSource.width}
                                    height={previewSource.height}
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
            const reactElements = [];
            // unpack preview images
            for (const key in metadata) {
                let image = metadata[key];
                const previewResolutions = image.p;
                const sortedPreviewResolutions = [...previewResolutions].sort((a, b) => b.x - a.x); // sort for DOM
                const previewSource = image.s;
                const previewId = image.id;
                // save as picture with source elements
                reactElements.unshift(
                    <Carousel.Item key={previewId + 'carouselItem'}>
                        <picture id={previewId} style={{padding: 0}}>
                            { // build srcset from `image.p`
                                sortedPreviewResolutions.map(image => {
                                    return (
                                        <source
                                            key={previewId + '@' + image.x}
                                            srcSet={he.decode(image.u)}
                                            media={`(min-width: ${image.x}px)`}
                                        //width={image.width}
                                        //height={image.height}
                                        />
                                    )
                                })}
                            <img src={he.decode(previewSource.u)} className="card-img-top" alt={altText} />
                        </picture></Carousel.Item>);
            }
            return (<Carousel
                interval={null}
                touch
                // needed for css transition of card element when (cannot animate computed values)
                onSelect={() => {
                }}
                onSlide={() => {
                }}
                onSlid={() => {
                }}
            >{reactElements}</Carousel>);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default Media;
