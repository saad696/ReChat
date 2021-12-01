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

import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import chatLogo from '../assests/chatLogo.png';

const SideBar = () => (
    <div className='channel-list__sidebar dark:bg-gray-800'>
        <div className='channel-list__sidebar__icon1 dark:bg-gray-600'>
            <div className='icon1__inner'>
                <img src={chatLogo} alt='ReChat' width='30' />
            </div>
        </div>
        <div className='channel-list__sidebar__icon2 dark:bg-gray-600'>
            <div className='icon2__inner'>
                <IconButton aria-label='delete'>
                    <LogoutIcon className='dark:text-gray-200' />
                </IconButton>
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
    return (
        <>
            <SideBar />
            <div className='channel-list__list__wrapper dark:bg-gray-700'>
                <CompanyHeader
                    setMode={setMode}
                    setIsModeChanged={setIsModeChanged}
                    mode={mode}
                />
                <ChannelSearch />
                <ChannelList
                    filters={{}}
                    channelRenderFilterFn={() => {}}
                    list={(listProps) => <TeamChannelList {...listProps} type='team' />}
                    Preview={(prevProps) => <TeamChannelPreview {...prevProps} type='team'/>}
                />
                <ChannelList
                    filters={{}}
                    channelRenderFilterFn={() => {}}
                    list={(listProps) => <TeamChannelList {...listProps} type='messaging' />}
                    Preview={(prevProps) => <TeamChannelPreview {...prevProps} type='messaging'/>}
                />
            </div>
        </>
    );
};

export default ChannelListContainer;
