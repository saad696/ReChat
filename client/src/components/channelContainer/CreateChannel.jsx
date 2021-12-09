import React, { useState } from 'react';
import { CloseCreateChannel } from '../../assests';
import { NotificationPopup, UserList } from '..';
import { useChatContext } from 'stream-chat-react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ChannelNameInput = ({
    channelName = '',
    setChannelName,
    err,
    setErr,
}) => {
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
    const { client, setActiveChannel, channel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
    const [error, setError] = useState(0);
    const [err, setErr] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();
        if (
            (createType === 'team' && channelName === '') ||
            null ||
            undefined
        ) {
            setErr('Channel name cannot be empty pal!');
        } else if (createType === 'team' && selectedUsers.length === 1) {
            setError(2);
        } else {
            if (createType !== 'team' && selectedUsers.length > 2) {
                setError(3);
            } else {
                try {
                    const newChannel = await client.channel(
                        createType,
                        channelName,
                        {
                            name: channelName,
                            members: selectedUsers,
                        }
                    );

                    await client.upsertUser({
                        id: client.userID,
                        role: 'admin',
                    });

                    await newChannel.watch();

                    setChannelName('');
                    setIsCreating(false);
                    setSelectedUsers([client.userID]);
                    setActiveChannel(newChannel);
                } catch (error) {
                    setError(1);
                }
            }
        }
    };

    return (
        <>
            {error === 1 && (
                <NotificationPopup
                    setMultipleErrorType={setError}
                    showPopup={error}
                    message='Something went wrong, please refresh.'
                    Type={1}
                    duration={4000}
                />
            )}
            {error === 2 && (
                <NotificationPopup
                    setMultipleErrorType={setError}
                    showPopup={error}
                    message='Please add users to create a channel.'
                    Type={3}
                    duration={4000}
                />
            )}
            {error === 3 && (
                <NotificationPopup
                    setMultipleErrorType={setError}
                    showPopup={error}
                    message='Cannot add more that one person to direct messages.'
                    Type={1}
                    duration={4000}
                />
            )}
            <div className='create-channel__container'>
                <div className='create-channel__header'>
                    <p>
                        {createType === 'team'
                            ? 'Create a New Channel'
                            : 'Send Direct Message'}
                    </p>
                    <CloseCreateChannel setIsCreating={setIsCreating} />
                </div>
                {createType === 'team' && (
                    <ChannelNameInput
                        channelName={channelName}
                        setChannelName={setChannelName}
                        err={err}
                        setErr={setErr}
                    />
                )}
                <UserList selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} type={'create'} createType={createType} />
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
