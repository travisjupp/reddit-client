import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

// return avatar icon img or default to identicon
function Avatar(props) {
    const { name, src } = props;
    const avatar = useMemo(() => {
        return createAvatar(identicon, {
            size: 28,
            seed: name,
            rowColor: ["c4c4c4"],
            // ... other options
        }).toDataUriSync();
    }, [name]);

    return !src ? <img src={avatar} alt="Avatar" /> :
        <img src={src} alt="Avatar" width={28} height={28} />;
}

export default Avatar;