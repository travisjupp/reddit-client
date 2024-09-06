import dashjs from "dashjs";
import {useEffect, useRef} from "react";

function VideoPlayer({redditVideoURL, postId}) {

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current?.id) return;
    const player = dashjs.MediaPlayer().create();
    try {
      player.initialize(ref.current, redditVideoURL, false);
      // player.on(dashjs.MediaPlayer.events.CAN_PLAY, () => {console.log('CAN_PLAY')});
    } catch (e) {
      console.error('Init Video Error: ', e.message);
    }
    return () => {
      // player.off(dashjs.MediaPlayer.events.CAN_PLAY, () => {console.log('CAN_PLAY')});
      player.destroy();
    }
  }, [redditVideoURL, ref]);

  return (
    <>
      <video ref={ref} id={'video-' + postId} controls className="card-img-top">
        <source src={redditVideoURL} />
      </video>
    </>
  );
}

export default VideoPlayer;
