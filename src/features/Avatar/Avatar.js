import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

function Avatar(props) {
    const { name } = props

    const avatar = useMemo(() => {
        return createAvatar(identicon, {
            size: 28,
            seed: name,
            rowColor: ["c4c4c4"],
            // ... other options
        }).toDataUriSync();
    }, [name]);

    return <img src={avatar} alt="Avatar" />;
}

export default Avatar;