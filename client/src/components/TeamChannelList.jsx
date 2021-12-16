import { CircularProgress } from '@mui/material';
import React from 'react';
import { ErrorHandler } from '.';
import { AddChannel } from '../assests';

const TeamChannelList = ({
    children,
    error = false,
    loading,
    type,
    setCreateType,
    isCreating,
    setIsCreating,
    setIsEditing,
    setToggleContainer,
}) => {
    if (error) {
        return type === 'team' ? (
            <ErrorHandler
                type={1}
                msg="Connection error, please wait a moment and try again"
            />
        ) : null;
    }

    if (loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading flex items-center">
                    Loading {type === 'team' ? 'Channels' : 'Messages'}
                    <CircularProgress size={20} className="ml-2" />
                </p>
            </div>
        );
    }

    return (
        <div className="team-channel-list pb-12">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {type === 'team' ? 'Channels' : 'Driect Messages'}
                </p>
                <AddChannel
                    setCreateType={setCreateType}
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            {children}
        </div>
    );
};

export default TeamChannelList;
