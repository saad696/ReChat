import React, { useState } from 'react';
import { Avatar } from 'stream-chat-react';
import { InviteIcon } from '../../assests';

const UserItem = ({ user, setSelectedUsers, type }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        if (!type) {
            if (selected) {
                setSelectedUsers((prevUsers) =>
                    prevUsers.filter((prevUser) => prevUser !== user.id)
                );
            } else {
                setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
            }
            setSelected((prevState) => !prevState);
        }
    };

    return (
        <div className="user-item__wrapper mt-3" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar
                    image={user.image}
                    name={user.name || user.fullName}
                    size={32}
                />
                <p className="user-item__name">{user.name || user.fullName}</p>
            </div>
            {!type &&
                (selected ? (
                    <InviteIcon />
                ) : (
                    <div className="user-item__invite-empty" />
                ))}
        </div>
    );
};

export default UserItem;
