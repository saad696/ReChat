import React, { useEffect, useState } from 'react';
import { UserList } from '../index';
import { CloseCreateChannel } from '../../assests';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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

const EditChannel = ({ setIsEditing }) => {
    const { client, channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const updateChannel = async (e) => {
        e.preventDefault();

        const changedName =
            channelName !== (channel.data.name || channelName.data.id);

        if (channelName) {
            await channel.update(
                { name: channelName },
                { text: `Channel name changed to ${channelName}` }
            );
        }

        if (selectedUsers.length) {
            await channel.addMembers(selectedUsers, {
                text: `${selectedUsers.toString()} Added to party`,
            });
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);
    };

    return (
        <div className='edit-channel__container'>
            <div className='edit-channel__header'>
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput
                channelName={channelName}
                setChannelName={setChannelName}
            />
            <UserList setSelectedUsers={setSelectedUsers} type={'edit'} />
            <div
                className='edit-channel__button-wrapper'
                onClick={updateChannel}
            >
                <p>Save Changes</p>
            </div>
        </div>
    );
};

export default EditChannel;
