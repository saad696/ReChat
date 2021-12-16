import React from 'react';
import { Avatar } from 'stream-chat-react';

const SelectedUsers = ({ user }) => {
    return (
        <>
            <div className="user-item__wrapper mt-3">
                <div className="user-item__name-wrapper">
                    <Avatar
                        image={user.image}
                        name={user.name || user.fullName}
                        size={32}
                    />
                    <p className="user-item__name">
                        {user.name || user.fullName}
                    </p>
                </div>
            </div>
        </>
    );
};

export default SelectedUsers;
