import React, { useEffect, useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import {
    ChannelSearch,
    TeamChannelSearch,
    TeamChannelPreview,
    ThemeSwitch,
    TeamChannelList,
} from './';
import Cookies from 'universal-cookie';

import { Avatar, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { ChannelInfo } from '../assests';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const cookies = new Cookies();

const SideBar = ({ logout, client }) => {
    const [user, setUser] = useState('');

    const getUser = async () => {
        const result = await client.queryUsers({
            id: { $in: [cookies.get('userId')] },
        });
        setUser(...result.users);
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className='channel-list__sidebar dark:bg-gray-800 '>
            {user && <Avatar className='mx-auto mt-5' src={user.image} />}
            <div className='channel-list__sidebar__icon2 dark:bg-gray-600'>
                <div className='icon2__inner'>
                    <Tooltip title='Logout'>
                        <IconButton onClick={logout} aria-label='delete'>
                            <LogoutIcon className='dark:text-gray-200' />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

const CompanyHeader = ({ setMode, mode, setIsModeChanged }) => (
    <div className='channel-list__header flex justify-between items-center'>
        <p className='channel-list__header__text dark:text-gray-300'>ReChat</p>
        <ThemeSwitch
            setMode={setMode}
            setIsModeChanged={setIsModeChanged}
            mode={mode}
        />
    </div>
);

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
};

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
};

const ChannelListContent = ({
    setMode,
    mode,
    setIsModeChanged,
    setCreateType,
    isCreating,
    setIsCreating,
    setIsEditing,
    setToggleContainer,
}) => {
    const logout = () => {
        cookies.remove('token');
        cookies.remove('userId');
        cookies.remove('userName');
        cookies.remove('fullName');
        cookies.remove('avatarUrl');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        window.location.reload();
    };

    const { client } = useChatContext();

    const filters = { members: { $in: [client.userID] } };

    return (
        <>
            <SideBar logout={logout} client={client} />
            <div className='channel-list__list__wrapper dark:bg-gray-900'>
                <CompanyHeader
                    setMode={setMode}
                    setIsModeChanged={setIsModeChanged}
                    mode={mode}
                />
                <ChannelSearch setToggleContainer={setToggleContainer} />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type='team'
                            setCreateType={setCreateType}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(prevProps) => (
                        <TeamChannelPreview
                            {...prevProps}
                            type='team'
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type='messaging'
                            setCreateType={setCreateType}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(prevProps) => (
                        <TeamChannelPreview
                            {...prevProps}
                            type='messaging'
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
            </div>
        </>
    );
};

const ChannelListContainer = ({
    setMode,
    mode,
    setIsModeChanged,
    setCreateType,
    isCreating,
    setIsCreating,
    setIsEditing,
}) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className='channel-list__container'>
                <ChannelListContent
                    setMode={setMode}
                    setIsModeChanged={setIsModeChanged}
                    mode={mode}
                    setCreateType={setCreateType}
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                />
            </div>
            <div
                className='channel-list__container-responsive'
                style={{
                    left: toggleContainer ? '0%' : '-89%',
                    backgroundColor: '#005fff',
                }}
            >
                <div
                style={{zIndex: 9999999}}
                    className='channerl-list__container-toggle  flex items-center justify-center'
                    onClick={() => {
                        setToggleContainer((prevState) => !prevState);
                    }}
                >
                   {toggleContainer ? <ArrowBackIcon className='text-white' />  : <ArrowForwardIcon className='text-white' />}
                </div>
                <ChannelListContent
                    setMode={setMode}
                    setIsModeChanged={setIsModeChanged}
                    mode={mode}
                    setCreateType={setCreateType}
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    );
};

export default ChannelListContainer;
