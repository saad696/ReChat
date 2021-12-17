import React, { useEffect, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { ErrorHandler, ResultsDropdown } from '.';
import { useChatContext } from 'stream-chat-react';

const ChannelSearch = ({ setToggleContainer, handleAppbarChange }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);
    const { client, setActiveChannel } = useChatContext();

    useEffect(() => {
        if (!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query]);

    const getChannels = async (text) => {
        if (text === '') {
            setTeamChannels([]);
            setDirectChannels([]);
        }
        try {
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID] },
            });

            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            });

            const [channels, { users }] = await Promise.all([
                channelResponse,
                userResponse,
            ]);

            if (channels.length) setTeamChannels(channels);
            if (users.length) setDirectChannels(users);
        } catch (err) {
            <ErrorHandler type={1} msg="Something went wrong!" />;
            setQuery('');
        }
    };

    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if ((directChannels.length && teamChannels.length) === 0) {
                setLoading(false);
            }
        }, 3000);

        setQuery(event.target.value);
        getChannels(event.target.value);
    };

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    };

    const queryNull = () => setQuery('');

    return (
        <div className="channel-search__container mb-4">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon className="text-gray-300 dark:text-gray-400" />
                </div>
                <input
                    className="channel-search__input__text placeholder-gray-300 dark:placeholder-gray-400"
                    placeholder="Search..."
                    type="text"
                    value={query}
                    onChange={onSearch}
                />
            </div>
            {query && (
                <ResultsDropdown
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                    handleAppbarChange={handleAppbarChange}
                    queryNull={queryNull}
                />
            )}
        </div>
    );
};

export default ChannelSearch;
