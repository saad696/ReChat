import { IconButton, Input } from '@mui/material';
import React, { useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { ErrorHandler } from '.';

const ChannelSearch = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const getChannels = async () => {
        try {
            //TODO: Fetch channels
        } catch (err) {
            <ErrorHandler type={1} msg='Something went wrong!' />;
            setQuery('');
        }
    };

    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true);

        setQuery(event.target.value);
        getChannels(event.target.value);
    };

    return (
        <div className='channel-search__container'>
            <div className='channel-search__input__wrapper'>
                <div className='channel-search__input__icon'>
                    <SearchIcon className='text-gray-300 dark:text-gray-400' />
                </div>
                <input
                    className='channel-search__input__text placeholder-gray-300 dark:placeholder-gray-400'
                    placeholder='Search...'
                    type='text'
                    value={query}
                    onChange={onSearch}
                />
            </div>
        </div>
    );
};

export default ChannelSearch;
