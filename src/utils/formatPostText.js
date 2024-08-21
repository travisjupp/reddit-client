// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';

// If html post text exists, decode html-entites, truncate and render.
// Else, render plain post text, truncate and render.
const formatPostText = (postTextHtml, postText, charLength, initialCharLength) => {
    try {
        if (postTextHtml) {
            return he.decode(postTextHtml)
                .substring(0, charLength || initialCharLength);
        } else {
            if (postText) {
                return postText.substring(0, charLength || initialCharLength);
            } else {
                return "";
            }
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default formatPostText;
