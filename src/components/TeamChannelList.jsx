import { CircularProgress } from '@mui/material';
import React from 'react';
import { ErrorHandler } from '.';

const TeamChannelList = ({ children, error = false, loading, type }) => {
    if (error) {
        return type === 'team' ? (
            <ErrorHandler
                type={1}
                msg='Connection error, please wait a moment and try again'
            />
        ) : null;
    }

    if (loading) {
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message loading'>
                    Loading {type === 'team' ? 'Channels' : 'Messages'}
                    <CircularProgress />
                </p>
            </div>
        );
    }

    return (
        <div className='team-channel-list'>
            <div className='team-channel-list__header'>
                <p className='team-channel-list__header__title'>
                    {type === 'team' ? 'Channels' : 'Driect Messages'}
                </p>
                {/* button */}
            </div>
            {children}
        </div>
    );
};

export default TeamChannelList;
