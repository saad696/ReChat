import { TextField } from '@mui/material';
import React, { useEffect } from 'react';

const ChannelSearch2 = ({
    type,
    setListEmpty,
    setUsers,
    setShowPopup,
    client,
    setChannelMembers,
    channel,
    setLoading,
    channelMembers,
}) => {
    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        if (!event.target.value) {
            setUsers([]);
            setLoading(false);
        } else if (event.target.value.length > 2) {
            if (type === 'edit' && client && channelMembers?.length > 0) {
                getUsers(event.target.value);
            } else if (type === 'create' && client) {
                getUsers(event.target.value);
            }
        }
    };

    useEffect(() => {
        if (type === 'edit') {
            getChannelUsers();
        }
    }, [type]);

    const getChannelUsers = async () => {
        let sort = { created_at: -1 };
        const members = await channel?.queryMembers({}, sort, {});
        setChannelMembers(members?.members);
    };

    const getUsers = async (text) => {
        let filteredUsers = [];
        try {
            const response = await client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            });

            if (response.users.length) {
                if (type === 'edit') {
                    setListEmpty(false);
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
                    setListEmpty(false);
                }
            } else {
                setListEmpty(true);
            }
        } catch (error) {
            setShowPopup(true);
        }
        setLoading(false);
    };

    return (
        <>
            <TextField
                size="small"
                variant="filled"
                name="search"
                onChange={onSearch}
                placeholder={'search for people...'}
                label="search"
                autoComplete="off"
            />
        </>
    );
};

export default ChannelSearch2;
