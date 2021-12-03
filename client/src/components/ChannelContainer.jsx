import { Drawer, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import {
    Channel,
    useChatContext,
    MessageTeam,
    Avatar,
    Streami18n,
} from 'stream-chat-react';
import {
    ChannelInner,
    CreateChannel,
    CustomThreadHeader,
    CustomTypingIndicator,
    EditChannel,
} from './';

const ClickedUser = (props) => {
    const { clickedUser, setClickedUser } = props;

    const defautFontSize = { fontSize: 14 };

    return (
        <Drawer
            anchor={'right'}
            open={clickedUser}
            onClose={() => setClickedUser(undefined)}
        >
            <div className='ml-2 mb-2 font-bold text-gray-500'>Tagged User</div>{' '}
            <hr />
            <div className='inner flex justify-center'>
                {clickedUser.image && (
                    <Avatar image={clickedUser.image} size={140} />
                )}
                <div>
                    <div className='name justify-center' style={defautFontSize}>
                        Name: {<p style={defautFontSize}>{clickedUser.name}</p>}{' '}
                        <div>
                            {clickedUser.online ? (
                                <Tooltip title='Status: Online'>
                                    <div className='online w-2 h-2 bg-green-600 rounded'></div>
                                </Tooltip>
                            ) : (
                                <Tooltip title='Status: Offline'>
                                    <div className='offline w-2 h-2 bg-gray-400 rounded'></div>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div className='role justify-center' style={defautFontSize}>
                        Role: {<p style={defautFontSize}>{clickedUser.role}</p>}
                    </div>
                    <div className='id justify-center' style={defautFontSize}>
                        Phone Number:{' '}
                        {
                            <p style={defautFontSize}>
                                {clickedUser.phoneNumber}
                            </p>
                        }
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

const ChannelContainer = ({
    isEditing,
    isCreating,
    setIsCreating,
    setIsEditing,
    createType,
}) => {
    const { channel } = useChatContext();
    const [clickedUser, setClickedUser] = useState();
    const i18nInstance = new Streami18n({
        language: 'en',
        translationsForLanguage: {
            'Connection failure, reconnecting now...':
                'Alert, connection issue happening',
        },
    });

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

    return (
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
                <ChannelInner setIsEditing={setIsEditing} />
                {clickedUser && (
                    <ClickedUser
                        clickedUser={clickedUser}
                        setClickedUser={setClickedUser}
                    />
                )}
            </Channel>
        </div>
    );
};

export default ChannelContainer;
