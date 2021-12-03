import React, { useState } from 'react';
import { CloseCreateChannel } from '../../assests';
import { NotificationPopup, UserList } from '..';
import { useChatContext } from 'stream-chat-react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const [err, setErr] = useState('');
    // const { client, setActiveChannel } = useChatContext();
    // const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.value.indexOf(' ') >= 0) {
            setErr('No whitespaces allowed in channel name.');
        } else {
            setChannelName(e.target.value);
            setErr('');
        }
    };

    return (
        <div className='channel-name-input__wrapper'>
            <p className='mb-2'>Name</p>
            <input
                value={channelName}
                onChange={handleChange}
                placeholder='Channel-name'
            />
            {err && <small className='ml-1 text-red-600'>{err}</small>}

            <p className='mb-3'>Add Members</p>
        </div>
    );
};

const CreateChannel = ({ createType, setIsCreating }) => {
    const [channelName, setChannelName] = useState('');
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [error, setError] = useState(false);

    const createChannel = async (e) => {
        e.preventDefault();
        try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName,
                members: selectedUsers,
            });

            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);
        } catch (error) {
            setError(true);
        }
    };

    return (
        <>
            {error && (
                <NotificationPopup
                    setShowPopup={setError}
                    showPopup={error}
                    message='Something went wrong, please refresh.'
                    Type={1}
                    duration={4000}
                />
            )}
            <div className='create-channel__container'>
                <div className='create-channel__header'>
                    <p>
                        {createType === 'team'
                            ? 'Create a Cew Channel'
                            : 'Send Direct Message'}
                    </p>
                    <CloseCreateChannel setIsCreating={setIsCreating} />
                </div>
                {createType === 'team' && (
                    <ChannelNameInput
                        channelName={channelName}
                        setChannelName={setChannelName}
                    />
                )}
                <UserList setSelectedUsers={setSelectedUsers} />
                <div
                    className='create-channel__button-wrapper'
                    onClick={createChannel}
                >
                    <p className='hover:bg-blue-800 transition-all'>
                        <AddIcon />
                        {createType === 'team'
                            ? 'Create Channel'
                            : 'Create Message Group'}
                    </p>
                </div>
            </div>
        </>
    );
};

export default CreateChannel;
