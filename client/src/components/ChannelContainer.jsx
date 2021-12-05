import { Drawer, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
    Channel,
    useChatContext,
    MessageTeam,
    Avatar,
    Streami18n,
} from 'stream-chat-react';
import Cookies from 'universal-cookie';
import chatBegin from '../assests/chat-begin.svg';
import {
    ChannelInner,
    ClickedUser,
    CreateChannel,
    CustomThreadHeader,
    CustomTypingIndicator,
    EditChannel,
} from './';

const ChannelContainer = ({
    isEditing,
    isCreating,
    setIsCreating,
    setIsEditing,
    createType,
}) => {
    const { channel, client } = useChatContext();
    const [clickedUser, setClickedUser] = useState();
    const [channelMembers, setChannelMembers] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const i18nInstance = new Streami18n({
        language: 'en',
        translationsForLanguage: {
            'Connection failure, reconnecting now...':
                'Alert, connection issue happening',
        },
    });

    const getChannelUsers = async () => {
        let sort = { created_at: -1 };
        const members = await channel?.queryMembers({}, sort, {});
        setChannelMembers(members.members);
    };

    useEffect(() => {
        if (isOpen) {
            getChannelUsers();
        }
    }, [isOpen]);

    const onMentionsClick = (event, user) => {
        setClickedUser(user);
    };

    if (isCreating) {
        return (
            <div className='channel__container'>
                <CreateChannel
                    createType={createType}
                    setIsCreating={setIsCreating}
                />
            </div>
        );
    }
    if (isEditing) {
        return (
            <div className='channel__container'>
                <EditChannel setIsEditing={setIsEditing} />
            </div>
        );
    }

    const EmptyState = () => {
        return (
            <div className='channel-empty__container'>
                <div className='channel-empty__first'>
                    This is the beginning of your chat history.
                </div>
                <div className='channel-empty__second'>
                    Send messages, attachments, links, emojis, and more!.
                </div>
            </div>
        );
    };

    const onMentionsHover = (event) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        event.target.style.color = `#${randomColor}`;
    };

    return channel ? (
        <div className='channel__container'>
            <Channel
                onMentionsClick={onMentionsClick}
                onMentionsHover={onMentionsHover}
                ThreadHeader={CustomThreadHeader}
                TypingIndicator={CustomTypingIndicator}
                EmptyStateIndicator={EmptyState}
                i18nInstance={i18nInstance}
                Message={(messageProps, i) => (
                    <MessageTeam key={i} {...messageProps} />
                )}
            >
                <ChannelInner
                    setIsEditing={setIsEditing}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    channelMembers={channelMembers}
                />
                {clickedUser && (
                    <ClickedUser
                        clickedUser={clickedUser}
                        setClickedUser={setClickedUser}
                        title='Tagged user'
                    />
                )}
            </Channel>
        </div>
    ) : (
        <div className='w-100 flex justify-center items-center'>
            <span>
                <h1 className='text-center text-5xl font-bold sm:text-4xl'>Welcome to ReChat</h1>
                <p className='text-center text-gray-400 mb-5'>Connect to people you like, to chat and have fun!</p>
                <img src={chatBegin} alt='chat-begin'/>
            </span>
        </div>
    );
};

export default ChannelContainer;
