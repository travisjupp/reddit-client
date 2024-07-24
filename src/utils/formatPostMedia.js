// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
// import parse from 'html-react-parser';

// If post media exists, decode html-entites and render.
const formatPostMedia = (postMedia, postMediaPreview) => {
    try {
        if (typeof postMedia.content === 'string') {
            // const postMediaDomElement = he.decode(postMedia.content);
            // => thumbnail media image component that opens a modal on click
            console.log('he.decode',he.decode(postMediaPreview.images[0].source.url))
            return <img src={he.decode(postMediaPreview.images[0].source.url)} alt="Media Preview" />
            // return parse(postMediaDomElement); // return parsed DOM node
        } else {
            return;
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default formatPostMedia;
