// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';
import parse from 'html-react-parser';


// If post media exists, decode html-entites and render. 
const formatPostMedia = (postMedia) => {
    try {
        if (typeof postMedia.content === 'string') {
            console.log('postMedia.content', postMedia.content);
            console.log('postMedia', postMedia);
            const domElement = he.decode(postMedia.content);
            // const parser = new DOMParser();
            // console.log("==>",parser.parseFromString(domElement, 'text/html').getElementsByTagName('iframe')[0]);
// return parser.parseFromString(domElement, 'text/html').getElementsByTagName('iframe')[0];
// return domElement;
return parse(domElement);
        } else {
            return;
        }
    } catch (e) {
        console.log('postMedia', postMedia)
        console.error('Error:', e.message);
    }
}

export default formatPostMedia;
