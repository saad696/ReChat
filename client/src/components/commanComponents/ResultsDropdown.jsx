import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const channelByUser = async ({
    client,
    setActiveChannel,
    channel,
    setChannel,
}) => {
    const filters = {
        type: 'messaging',
        member_count: 2,
        members: { $eq: [client.user.id, client.userID] },
    };

    const [existingChannel] = await client.queryChannels(filters);

    if (existingChannel) return setActiveChannel(existingChannel);

    const newChannel = client.channel('messaging', {
        members: [channel.id, client.userID],
    });

    setChannel(newChannel);

    return setActiveChannel(newChannel);
};

const SearchResult = ({
    channel,
    focusedId,
    type,
    setChannel,
    setToggleContainer,
}) => {
    const { client, setActiveChannel } = useChatContext();
    if (type === 'channel') {
        return (
            <div
                onClick={() => {
                    setChannel(channel);
                    if (setToggleContainer) {
                        setToggleContainer((prevState) => !prevState);
                    }
                }}
                className={
                    focusedId === channel.id
                        ? 'channel-search__result-container__focused'
                        : 'channel-search__result-container'
                }
            >
                <div className='result-hashtag'>#</div>
                <p className='channel-search__result-text'>
                    {channel.data.name}
                </p>
            </div>
        );
    }

    return (
        <div
            onClick={async () => {
                channelByUser({
                    client,
                    setActiveChannel,
                    channel,
                    setChannel,
                });
                if (setToggleContainer) {
                    setToggleContainer((prevState) => !prevState);
                }
            }}
            className={
                focusedId === channel.id
                    ? 'channel-search__result-container__focused'
                    : 'channel-search__result-container'
            }
        >
            <div className='channel-search__result-user'>
                <Avatar
                    image={channel.image || undefined}
                    name={channel.name}
                    size={24}
                />
                <p className='channel-search__result-text flex items-center'>
                    {channel.name}
                    {channel.online ? (
                        <div className='online w-2 h-2 bg-green-600 rounded ml-2'></div>
                    ) : (
                        <div className='offline w-2 h-2 bg-gray-400 rounded ml-2'></div>
                    )}
                </p>
            </div>
        </div>
    );
};

const ResultsDropdown = ({
    teamChannels,
    directChannels,
    focusedId,
    loading,
    setChannel,
    setToggleContainer,
}) => {

    return (
        <div className='channel-search__results'>
            <p className='channel-search__results-header'>Channels</p>
            {loading && !teamChannels.length && (
                <CircularProgress size={20} className='ml-3 mv-2' />
            )}
            {!loading && !teamChannels.length ? (
                <p className='channel-search__results-header'>
                    <i>No channels found</i>
                </p>
            ) : (
                teamChannels?.map((channel, i) => (
                    <SearchResult
                        channel={channel}
                        focusedId={focusedId}
                        key={i}
                        setChannel={setChannel}
                        type='channel'
                        setToggleContainer={setToggleContainer}
                    />
                ))
            )}
            <p className='channel-search__results-header'>Users</p>
            {loading && !directChannels.length && (
                <CircularProgress size={20} className='ml-3 mv-2' />
            )}
            {!loading && !directChannels.length ? (
                <p className='channel-search__results-header'>
                    <i>No direct messages found</i>
                </p>
            ) : (
                directChannels?.map((channel, i) => (
                    <SearchResult
                        channel={channel}
                        focusedId={focusedId}
                        key={i}
                        setChannel={setChannel}
                        type='user'
                        setToggleContainer={setToggleContainer}
                    />
                ))
            )}
        </div>
    );
};

export default ResultsDropdown;
