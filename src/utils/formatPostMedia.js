// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
import parse from 'html-react-parser';

// If post media exists, decode html-entites and render. 
const formatPostMedia = (postMedia) => {
    try {
        if (typeof postMedia.content === 'string') {
            const domElement = he.decode(postMedia.content);
return parse(domElement);
        } else {
            return;
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default formatPostMedia;
