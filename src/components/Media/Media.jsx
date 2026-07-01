import { useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import VideoPlayer from '../../features/VideoPlayer/VideoPlayer';
import he from 'he';
import parse from 'html-react-parser';
// If post media exists, decode html-entites and render.
// Searches for available media types: image galleries, images, reddit-hosted video, and embedded media from 3rd party sites eg. twitch/youtube videos
const Media = ({ postMedia, postId, postIdx }) => {
  const { mediaEmbed, preview, isGallery, metadata, altText, redditVideo } =
    postMedia;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const previewResolutions = preview?.images[0].resolutions || [];
  const sortedPreviewResolutions = [...previewResolutions].sort(
    (a, b) => b.width - a.width,
  ); // Sort for DOM (largest image first)
  const previewId = preview?.images[0].id; // Get preview id
  const previewSource = preview?.images[0].source; // Get preview source
  const postMediaDomElement = he.decode(mediaEmbed.content || ''); // Embedded iframes
  const redditVideoURL = he.decode(redditVideo?.dash_url || '');

  try {
    // REDDIT VIDEO CHECKER check for reddit hosted video (MPEG-DASH)
    if (redditVideoURL) {
      return <VideoPlayer redditVideoURL={redditVideoURL} postId={postId} />;
    }
    // PREVIEW CHECKER check for previews, or image only posts
    if (preview) {
      // Return picture with source elements
      return (
        <picture id={previewId} style={{ padding: 0 }}>
          {
            // Build srcset from `preview.images[0].resolutions`
            sortedPreviewResolutions.map(image => {
              return (
                <source
                  key={previewId + '@' + image.width}
                  srcSet={he.decode(image.url)}
                  media={`(min-width: ${image.width}px)`}
                  width={image.width}
                  height={image.height}
                />
              );
            })
          }
          {
            // MEDIA CHECKER check for embedded media (iframe DOM elements)
            // Media preview image opens media source in modal on click
            typeof mediaEmbed.content === 'string' ?
              <>
                <img
                  onClick={handleShow}
                  src={he.decode(previewSource.url)}
                  width={previewSource.width}
                  height={previewSource.height}
                  className='card-img-top'
                  alt={altText}
                  loading={postIdx > 3 ? 'lazy' : 'eager'}
                  data-postidx={postIdx}
                />
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton />
                  <Modal.Body className='row-cols-1'>
                    {parse(postMediaDomElement)}
                  </Modal.Body>
                </Modal>
              </>
              // If post media is not DOM element render image
            : <>
                <img
                  onClick={handleShow}
                  src={he.decode(previewSource.url)}
                  width={previewSource.width}
                  height={previewSource.height}
                  className='card-img-top'
                  alt={altText}
                  loading={postIdx > 3 ? 'lazy' : 'eager'}
                  fetchpriority={postIdx > 0 ? 'low' : 'high'}
                  data-postidx={postIdx}
                />
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton />
                  <Modal.Body className='row-cols-1'>
                    <img src={he.decode(previewSource.url)} alt={altText} />
                  </Modal.Body>
                </Modal>
              </>

          }
        </picture>
      );
    }
    // GALLERY CHECKER check for image galleries
    if (isGallery) {
      const reactElements = [];
      // Unpack preview images
      for (const key in metadata) {
        let image = metadata[key];
        const previewResolutions = image.p;
        const sortedPreviewResolutions = [...previewResolutions].sort(
          (a, b) => b.x - a.x,
        ); // Sort for DOM
        const previewSource = image.s;
        const previewId = image.id;
        const isAnimatedImage = image.e === 'AnimatedImage';
 
        if (isAnimatedImage) {
          // Save AnimatedImage as video with source elements
          reactElements.unshift(
            <Carousel.Item key={previewId + 'carouselItem'}>
              <video
                height={'100%'}
                width={'100%'}
                autoPlay={true}
                playsInline={true}
                loop={true}
                id={previewId}
                style={{ padding: 0, width: '100%', height: '100%' }}
              >
                <source
                  src={he.decode(previewSource.mp4 || '')}
                  width={previewSource.x}
                  height={previewSource.y}
                  className='card-img-top'
                  alt={altText}
                  loading={postIdx > 3 ? 'lazy' : 'eager'}
                  type='video/mp4'
                  data-postidx={postIdx}
                />
              </video>
            </Carousel.Item>,
          );
        } else {
          // Save standard Image as picture with source elements
          reactElements.unshift(
            <Carousel.Item key={previewId + 'carouselItem'}>
              <picture
                width={'100%'}
                height={'100%'}
                id={previewId}
                style={{ padding: 0, width: '100%', height: '100%' }}
              >
                {
                  // Build srcset from `image.p`
                  sortedPreviewResolutions.map(image => {
                    return (
                      <source
                        key={previewId + '@' + image.x}
                        srcSet={he.decode(image.u)}
                        media={`(min-width: ${image.x}px)`}
                        width={image.x}
                        height={image.y}
                      />
                    );
                  })
                }
                <img
                  src={he.decode(
                    previewSource.u ||
                      previewSource.gif ||
                      previewSource.mp4 ||
                      '',
                  )}
                  width={previewSource.x}
                  height={previewSource.y}
                  className='card-img-top'
                  alt={altText}
                  loading={postIdx > 3 ? 'lazy' : 'eager'}
                  data-postidx={postIdx}
                />
              </picture>
            </Carousel.Item>,
          );
        }
      }
      return (
        <Carousel interval={null} touch>
          {reactElements}
        </Carousel>
      );
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
};

export default Media;
