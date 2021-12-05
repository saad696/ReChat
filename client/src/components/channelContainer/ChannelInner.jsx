import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
    MessageList,
    MessageInput,
    Thread,
    Window,
    useChannelActionContext,
    Avatar,
    useChannelStateContext,
    useChatContext,
} from 'stream-chat-react';

import { ChannelInfo } from '..//../assests';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UsersMenu from '../commanComponents/UsersMenu';
import Cookies from 'universal-cookie';
import { NotificationPopup } from '..';

const cookies = new Cookies();

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing, isOpen, setIsOpen, channelMembers }) => {
    const [giphyState, setGiphyState] = useState(false);
    const { sendMessage } = useChannelActionContext();

    const overrideSubmitHandler = (message) => {
        let updatedMessage = {
            attachments: message.attachments,
            mentioned_users: message.mentioned_users,
            parent_id: message.parent?.id,
            parent: message.parent,
            text: message.text,
        };

        if (giphyState) {
            updatedMessage = {
                ...updatedMessage,
                text: `/giphy ${message.text}`,
            };
        }

        if (sendMessage) {
            sendMessage(updatedMessage);
            setGiphyState(false);
        }
    };

    return (
        <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
            <div style={{ display: 'flex', width: '100%' }}>
                <Window>
                    <TeamChannelHeader
                        setIsEditing={setIsEditing}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        channelMembers={channelMembers}
                    />
                    <MessageList />
                    <MessageInput
                        overrideSubmitHandler={overrideSubmitHandler}
                    />
                </Window>
                <Thread />
            </div>
        </GiphyContext.Provider>
    );
};

const TeamChannelHeader = ({
    setIsEditing,
    setIsOpen,
    isOpen,
    channelMembers,
}) => {
    const { channel, watcher_count } = useChannelStateContext();
    const { client } = useChatContext();

    const [usersOnline, setUsersOnline] = useState();

    const MessagingHeader = () => {
        const members = Object.values(channel.state.members).filter(
            ({ user }) => user.id !== client.userID
        );
        const additionalMembers = members.length - 3;

        const [isAdmin, setIsAdmin] = useState(false);
        const [openNoti, setOpenNoti] = useState(false);

        const getCurrentUser = async () => {
            const result = await client.queryUsers({
                id: { $in: [cookies.get('userId')] },
            });
            if (result?.users[0]?.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        useEffect(() => {
            getCurrentUser();
        }, []);

        if (channel.type === 'messaging') {
            return (
                <div className='team-channel-header__name-wrapper'>
                    {members.map(({ user }, i) => (
                        <div
                            key={i}
                            className='team-channel-header__name-multi'
                        >
                            <Avatar
                                image={user.image}
                                name={user.name || user.fullName}
                                size={32}
                            />
                            <p className='team-channel-header__name user'>
                                {user.name || user.fullName}
                            </p>
                        </div>
                    ))}

                    {additionalMembers > 0 && (
                        <p className='team-channel-header__name user'>
                            and {additionalMembers} more
                        </p>
                    )}
                </div>
            );
        }

        return (
            <>
                {openNoti && (
                    <NotificationPopup
                        setShowPopup={setOpenNoti}
                        showPopup={openNoti}
                        message={'Only Admin can edit the channel.'}
                        duration={2000}
                        Type={3}
                    />
                )}
                <div className='team-channel-header__channel-wrapper'>
                    <p className='team-channel-header__name'>
                        # {channel.data.name}
                    </p>
                    <IconButton
                        onClick={() => {
                            isAdmin ? setIsEditing(true) : setOpenNoti(true);
                        }}
                    >
                        <MoreVertIcon fontSize='small' />
                    </IconButton>
                </div>
            </>
        );
    };

    const getWatcherText = (watchers) => {
        if (!watchers) return 'No users online';
        if (watchers === 1) return '1 user online';
        return `${watchers} users online`;
    };

    const channelMembersCount = async () => {
        let count = 0;
        let sort = { created_at: 1 };
        const users = await channel.queryMembers({}, sort, {});
        for (let x of users.members) {
            if (x.user.online) {
                count = count + 1;
            }
        }

        setUsersOnline(count);
    };

    useEffect(() => {
        channelMembersCount()
    }, [usersOnline]);

    const handleClose = () => {
        setIsOpen(false);
    };
    const anchorRef = React.useRef(null);
    return (
        <div className='team-channel-header__container'>
            <MessagingHeader />
            <div className='team-channel-header__right flex'>
                <p className='team-channel-header__right-text mr-2'>{usersOnline === 1 ? `1 user online` : `${usersOnline} users online`}</p>
                <IconButton
                    ref={anchorRef}
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    <ChannelInfo />
                </IconButton>
            </div>

            <UsersMenu
                isOpen={isOpen}
                handleClose={handleClose}
                anchorRef={anchorRef.current}
                channelMembers={channelMembers}
            />
        </div>
    );
};

export default ChannelInner;
