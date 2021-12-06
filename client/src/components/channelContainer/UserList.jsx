import { CircularProgress, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { NotificationPopup } from '..';
import { InviteIcon } from '../../assests';

const ListConatiner = ({ children }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    );
};

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        if (selected) {
            setSelectedUsers((prevUsers) =>
                prevUsers.filter((prevUser) => prevUser !== user.id)
            );
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
        }
        setSelected((prevState) => !prevState);
    };

    return (
        <div className='user-item__wrapper mt-3' onClick={handleSelect}>
            <div className='user-item__name-wrapper'>
                <Avatar
                    image={user.image}
                    name={user.name || user.fullName}
                    size={32}
                />
                <p className='user-item__name'>{user.name || user.fullName}</p>
            </div>
            {selected ? (
                <InviteIcon />
            ) : (
                <div className='user-item__invite-empty' />
            )}
        </div>
    );
};

const UserList = ({ setSelectedUsers, type }) => {
    const { client, channel } = useChatContext();
    const [users, setUsers] = useState([]);
    const [channelMembers, setChannelMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const getChannelUsers = async () => {
        let sort = { created_at: -1 };
        const members = await channel?.queryMembers({}, sort, {});
        setChannelMembers(members?.members);
    };

    useEffect(() => {
        if (type === 'edit') {
            getChannelUsers();
        }
    }, []);

    const getUsers = async () => {
        if (loading) return;
        setLoading(true);
        let filteredUsers = [];
        try {
            const response = await client.queryUsers(
                { id: { $ne: client.userID } },
                { id: 1 },
                { limit: 8 }
            );

            if (response.users.length) {
                if (type === 'edit') {
                    let _users = [...response.users];

                    const arr = _users.filter((user) => {
                        return channelMembers.some((member) => {
                            return user.id === member.user_id;
                        });
                    });

                    for (let x in _users) {
                        if (!arr.includes(_users[x])) {
                            filteredUsers.push(_users[x]);
                        }
                    }

                    setUsers(filteredUsers);
                } else if (type === 'create') {
                    setUsers(response.users);
                }
            } else {
                setListEmpty(true);
            }
        } catch (error) {
            setShowPopup(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (type === 'edit' && client && channelMembers?.length > 0) {
            getUsers();
        } else if (type === 'create' && client) {
            getUsers();
        }
    }, [channelMembers]);

    if (showPopup) {
        return (
            <>
                {showPopup && (
                    <NotificationPopup
                        setShowPopup={setShowPopup}
                        showPopup={showPopup}
                        message='Something went wrong!'
                        Type={1}
                        duration={10000}
                    />
                )}
                <ListConatiner>
                    <div className='user-list__message font-extrabold text-gray-300 h-100 flex justify-center items-center'>
                        Error loading, please try again by refreshing the page.
                    </div>
                </ListConatiner>
            </>
        );
    }

    if (listEmpty) {
        return (
            <>
                {listEmpty && (
                    <NotificationPopup
                        setShowPopup={setShowPopup}
                        showPopup={showPopup}
                        message='No users found!'
                        Type={2}
                        duration={10000}
                    />
                )}
                <ListConatiner>
                    <div className='user-list__message font-extrabold text-gray-300 h-100 flex justify-center items-center'>
                        No users found!
                    </div>
                </ListConatiner>
            </>
        );
    }

    return (
        <>
            <ListConatiner>
                {loading ? (
                    <div className='user-list__message flex justify-center items-center'>
                        <CircularProgress size='small' />
                        <p className='ml-2'>Loading users...</p>
                    </div>
                ) : (
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
