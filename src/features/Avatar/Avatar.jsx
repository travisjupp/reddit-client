import React, {useMemo} from 'react';
import {createAvatar} from '@dicebear/core';
import {identicon} from '@dicebear/collection';

// return avatar icon img or default to identicon
function Avatar(props) {
    const {name, src, size = 28} = props;
    const avatar = useMemo(() => {
        return createAvatar(identicon, {
            size: size,
            seed: name,
            rowColor: ["c4c4c4"],
            // ... other options
        }).toDataUriSync();
    }, [name, size]);
    // render avatar or identicon if src not provided
    return !src ? <img src={avatar} alt="Avatar" width={size + 'px'} height={size + 'px'} style={{borderRadius: "50%"}} /> :
        <img src={src} alt="Avatar" width={size + 'px'} height={size + 'px'} style={{borderRadius: "50%"}} />;
}

export default Avatar;
