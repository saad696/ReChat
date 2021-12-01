import React from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import {
    ChannelSearch,
    TeamChannelSearch,
    TeamChannelPreview,
    ThemeSwitch,
    TeamChannelList,
} from './';
import Cookies from 'universal-cookie';

import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import chatLogo from '../assests/chatLogo.png';

const cookies = new Cookies();

const SideBar = ({ logout }) => (
    <div className='channel-list__sidebar dark:bg-gray-800'>
        <div className='channel-list__sidebar__icon1 dark:bg-gray-600'>
            <div className='icon1__inner'>
                <img src={chatLogo} alt='ReChat' width='30' />
            </div>
        </div>
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

const ChannelListContainer = ({ setMode, mode, setIsModeChanged }) => {
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

    return (
        <>
            <SideBar logout={logout} />
            <div className='channel-list__list__wrapper dark:bg-gray-900'>
                <CompanyHeader
                    setMode={setMode}
                    setIsModeChanged={setIsModeChanged}
                    mode={mode}
                />
                <ChannelSearch />
                <ChannelList
                    filters={{}}
                    channelRenderFilterFn={() => {}}
                    List={(listProps) => (
                        <TeamChannelList {...listProps} type='team' />
                    )}
                    Preview={(prevProps) => (
                        <TeamChannelPreview {...prevProps} type='team' />
                    )}
                />
                <ChannelList
                    filters={{}}
                    channelRenderFilterFn={() => {}}
                    List={(listProps) => (
                        <TeamChannelList {...listProps} type='messaging' />
                    )}
                    Preview={(prevProps) => (
                        <TeamChannelPreview {...prevProps} type='messaging' />
                    )}
                />
            </div>
        </>
    );
};

export default ChannelListContainer;
