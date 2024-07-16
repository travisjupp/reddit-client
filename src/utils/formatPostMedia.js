// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';

// If post media exists, decode html-entites and render. 
const formatPostMedia = (postMedia) => {
    try {
        if (postMedia) {
            return he.decode(postMedia.content);
        } else {
            return;
        }
    } catch (e) {
        console.log('postMedia', postMedia)
        console.error('Error:', e.message);
    }
}

export default formatPostMedia;
