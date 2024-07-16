const validateImgURL = (url) => {
  if (!url) {
    return;
  }
  const re = /.*png|.*jpg|.*jpeg/;
  return url.match(re) ? url.match(re)[0] : null;
}
export default validateImgURL;
