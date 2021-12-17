import { CircularProgress, IconButton } from '@mui/material';
import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import useWindowDimensions from '../../hooks/use-window-dimensions.ts';
import CancelIcon from '@mui/icons-material/Cancel';

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
    handleAppbarChange,
}) => {
    const { client, setActiveChannel } = useChatContext();
    // eslint-disable-next-line no-unused-vars
    const { width, height } = useWindowDimensions();
    if (type === 'channel') {
        return (
            <div
                onClick={() => {
                    setChannel(channel);
                    if (setToggleContainer) {
                        setToggleContainer((prevState) => !prevState);
                    }
                    if (width < 768) {
                        handleAppbarChange('_', 2);
                    }
                }}
                className={
                    focusedId === channel.id
                        ? 'channel-search__result-container__focused'
                        : 'channel-search__result-container'
                }
            >
                <div className="result-hashtag">#</div>
                <p className="channel-search__result-text">
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
            <div className="channel-search__result-user">
                <Avatar
                    image={channel.image || undefined}
                    name={channel.name}
                    size={24}
                />
                <p className="channel-search__result-text flex items-center">
                    {channel.name}
                    {channel.online ? (
                        <div className="online w-2 h-2 bg-green-600 rounded ml-2"></div>
                    ) : (
                        <div className="offline w-2 h-2 bg-gray-400 rounded ml-2"></div>
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
    handleAppbarChange,
    queryNull,
}) => {
    return (
        <div className="channel-search__results p-4">
            <div className="flex justify-between">
                <p className="channel-search__results-header">Channels</p>
                <IconButton onClick={queryNull}>
                    <CancelIcon />{' '}
                </IconButton>
            </div>
            {loading && !teamChannels.length && (
                <CircularProgress size={20} className="ml-3 mv-2" />
            )}
            {!loading && !teamChannels.length ? (
                <p className="channel-search__results-header">
                    <i>No channels found</i>
                </p>
            ) : (
                teamChannels?.map((channel, i) => (
                    <SearchResult
                        channel={channel}
                        focusedId={focusedId}
                        key={i}
                        setChannel={setChannel}
                        type="channel"
                        setToggleContainer={setToggleContainer}
                        handleAppbarChange={handleAppbarChange}
                    />
                ))
            )}
            <p className="channel-search__results-header">Users</p>
            {loading && !directChannels.length && (
                <CircularProgress size={20} className="ml-3 mv-2" />
            )}
            {!loading && !directChannels.length ? (
                <p className="channel-search__results-header">
                    <i>No direct messages found</i>
                </p>
            ) : (
                directChannels?.map((channel, i) => (
                    <SearchResult
                        channel={channel}
                        focusedId={focusedId}
                        key={i}
                        setChannel={setChannel}
                        type="user"
                        setToggleContainer={setToggleContainer}
                        handleAppbarChange={handleAppbarChange}
                    />
                ))
            )}
        </div>
    );
};

export default ResultsDropdown;
