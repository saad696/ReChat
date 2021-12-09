import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { ChannelSearch2, NotificationPopup, SelectedUsers, UserItem } from '..';

const ListConatiner = ({
    children,
    type,
    setListEmpty,
    setUsers,
    setShowPopup,
    client,
    setChannelMembers,
    channel,
    loading,
    setLoading,
    channelMembers,
    selectedUsers,
    createType,
}) => {
    const [_selectedUsers, _setSelectedUsers] = useState([]);
    useEffect(async () => {
        if (selectedUsers?.length > 0) {
            const response = await client.queryUsers({
                id: { $in: [...selectedUsers] },
            });

            _setSelectedUsers(response.users);
        }
    }, [selectedUsers]);

    return (
        <>
            <ChannelSearch2
                type={type}
                setListEmpty={setListEmpty}
                setUsers={setUsers}
                setShowPopup={setShowPopup}
                client={client}
                setChannelMembers={setChannelMembers}
                channel={channel}
                loading={loading}
                setLoading={setLoading}
                channelMembers={channelMembers}
            />
            {createType === 'team' && type === 'edit' && (
                <>
                    <div className='user-list__header'>
                        <p>Existing Users</p>
                    </div>
                    <div style={{ height: '550px', overflowY: 'scroll' }}>
                        {channelMembers?.map((user, i) => (
                            <UserItem
                                key={user.user.id}
                                index={i}
                                user={user.user}
                                type='existing'
                            />
                        ))}
                    </div>
                    <hr />
                </>
            )}
            {createType === 'team' && _selectedUsers.length > 1 && (
                <>
                    <div className='user-list__header'>
                        <p>Selected Users</p>
                        <p>Selected</p>
                    </div>
                    <div style={{ height: '550px', overflowY: 'scroll' }}>
                        {_selectedUsers?.map(
                            (user, i) =>
                                user.id !== client.userID && (
                                    <SelectedUsers
                                        key={user.id}
                                        index={i}
                                        user={user}
                                        type='selected'
                                    />
                                )
                        )}
                    </div>
                    <hr className='mt-3' />
                </>
            )}
            <div className='user-list__container'>
                <div className='user-list__header'>
                    <p>Users</p>
                    <p>Invite</p>
                </div>
                {children}
            </div>
        </>
    );
};

const UserList = ({ selectedUsers, setSelectedUsers, type, createType }) => {
    const { client, channel } = useChatContext();
    const [users, setUsers] = useState([]);
    const [channelMembers, setChannelMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <ListConatiner
                type={type}
                setListEmpty={setListEmpty}
                setUsers={setUsers}
                setShowPopup={setShowPopup}
                client={client}
                setChannelMembers={setChannelMembers}
                channel={channel}
                loading={loading}
                setLoading={setLoading}
                channelMembers={channelMembers}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                createType={createType}
            >
                {users.length === 0 && !showPopup && !listEmpty && !loading && (
                    <div className='user-list__message font-extrabold text-gray-300 flex justify-center'>
                        Search for people you wanna add.
                    </div>
                )}
                {showPopup && (
                    <>
                        <NotificationPopup
                            setShowPopup={setShowPopup}
                            showPopup={showPopup}
                            message='Something went wrong!'
                            Type={1}
                            duration={10000}
                        />
                        <div className='user-list__message font-extrabold text-gray-300 flex justify-center'>
                            Error loading, please try again by refreshing the
                            page.
                        </div>
                    </>
                )}
                {listEmpty && (
                    <>
                        <NotificationPopup
                            setShowPopup={setShowPopup}
                            showPopup={showPopup}
                            message='No users found!'
                            Type={2}
                            duration={10000}
                        />
                        <div className='user-list__message font-extrabold text-gray-300 flex justify-center'>
                            No users found!
                        </div>
                    </>
                )}
                {loading ? (
                    <div className='user-list__message flex justify-center items-center'>
                        <CircularProgress size='small' />
                        <p className='ml-2 flex items-center'>
                            <CircularProgress size={20} className='mr-2' />
                            Loading users...
                        </p>
                    </div>
                ) : (
                    !showPopup &&
                    !listEmpty &&
                    users?.map((user, i) => (
                        <UserItem
                            key={user.id}
                            index={i}
                            user={user}
                            setSelectedUsers={setSelectedUsers}
                        />
                    ))
                )}
            </ListConatiner>
        </>
    );
};

export default UserList;
