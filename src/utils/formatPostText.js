// https://github.com/mathiasbynens/he
// he (for “HTML entities”) is a robust HTML entity encoder/decoder written in JavaScript.
import he from 'he';

// If html post text exists, decode html-entites, truncate and render. 
// Else, render plain post text and truncate.
const formatPostText = (postTextHtml, postText, charLength) => {
    // console.log('post text decoded: ', postTextHtml !== null ? he.decode(postTextHtml) : null);
    try {
        return postTextHtml !== null ?
            he.decode(postTextHtml)
                .substring(0, charLength) :
            postText !== null ?
                postText.substring(0, charLength) :
                ""
    } catch (e) {
        console.error('Error:', e.message);
    }
}

export default formatPostText;