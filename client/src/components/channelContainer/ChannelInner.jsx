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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UsersMenu from '../commanComponents/UsersMenu';
import { NotificationPopup } from '..';
import useWindowDimensions from '../../hooks/use-window-dimensions.ts';

export const GiphyContext = React.createContext({});

const ChannelInner = ({
    setIsEditing,
    isOpen,
    setIsOpen,
    channelMembers,
    handleAppbarChange,
}) => {
    const [giphyState, setGiphyState] = useState(false);
    const [openNoti, setOpenNoti] = useState(false);
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
        <>
            {openNoti && (
                <NotificationPopup
                    setShowPopup={setOpenNoti}
                    showPopup={openNoti}
                    message={'Only Admin can edit the channel.'}
                    duration={3000}
                    Type={3}
                />
            )}
            <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
                <div style={{ display: 'flex', width: '100%' }}>
                    <Window>
                        <TeamChannelHeader
                            setIsEditing={setIsEditing}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            channelMembers={channelMembers}
                            setOpenNoti={setOpenNoti}
                            handleAppbarChange={handleAppbarChange}
                        />
                        <MessageList onlySenderCanEdit={true} />
                        <MessageInput
                            overrideSubmitHandler={overrideSubmitHandler}
                        />
                    </Window>
                    <Thread />
                </div>
            </GiphyContext.Provider>
        </>
    );
};

const TeamChannelHeader = ({
    setIsEditing,
    setIsOpen,
    isOpen,
    channelMembers,
    setOpenNoti,
    handleAppbarChange,
}) => {
    const { channel } = useChannelStateContext();
    const { client } = useChatContext();
    // eslint-disable-next-line no-unused-vars
    const { width, height } = useWindowDimensions();

    const [usersOnline, setUsersOnline] = useState();

    const MessagingHeader = () => {
        const members = Object.values(channel.state.members).filter(
            ({ user }) => user.id !== client.userID
        );
        const additionalMembers = members.length - 3;

        const [isAdmin, setIsAdmin] = useState(false);

        const getCurrentUser = async () => {
            if (channel.data.created_by.id === client.userID) {
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
                <>
                    <div className="team-channel-header__name-wrapper">
                        {width < 768 && (
                            <IconButton
                                onClick={() => {
                                    if (width < 768) {
                                        handleAppbarChange('_', 1);
                                    }
                                }}
                            >
                                <ArrowBackIcon fontSize="small" />
                            </IconButton>
                        )}
                        {members.map(({ user }, i) => (
                            <div
                                key={i}
                                className="team-channel-header__name-multi ml-2"
                            >
                                <Avatar
                                    image={user.image}
                                    name={user.name || user.fullName}
                                    size={32}
                                />
                                <div>
                                    <p className="team-channel-header__name user font-bold">
                                        {user.name || user.fullName}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {additionalMembers > 0 && (
                            <p className="team-channel-header__name user">
                                and {additionalMembers} more
                            </p>
                        )}
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="team-channel-header__channel-wrapper">
                    {width < 768 && (
                        <IconButton
                            onClick={() => {
                                if (width < 768) {
                                    handleAppbarChange('_', 1);
                                }
                            }}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    )}
                    <p className="team-channel-header__name ml-2">
                        # {channel.data.name}
                    </p>
                    <IconButton
                        onClick={() => {
                            isAdmin ? setIsEditing(true) : setOpenNoti(true);
                        }}
                    >
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                </div>
            </>
        );
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
        channelMembersCount();
    }, [channelMembers]);

    const handleClose = () => {
        setIsOpen(false);
    };
    const anchorRef = React.useRef(null);
    return (
        <div className="team-channel-header__container">
            <MessagingHeader />
            <div className="team-channel-header__right flex">
                {channel.type !== 'messaging' && (
                    <p className="team-channel-header__right-text">
                        {usersOnline === 1
                            ? `1 online`
                            : `${usersOnline} online`}
                    </p>
                )}
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
