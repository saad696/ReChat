import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { Avatar as MuiAvatar } from '@mui/material';
import stringAvatar from '../utilities/AvatarCreator';
import useWindowDimensions from '../hooks/use-window-dimensions';

const TeamChannelPreview = ({
    channel,
    type,
    setToggleContainer,
    setIsCreating,
    setIsEditing,
    setActiveChannel,
    handleAppbarChange,
}) => {
    const { channe: activeChannel, client } = useChatContext();
    // eslint-disable-next-line no-unused-vars
    const { width, height } = useWindowDimensions();

    const ChannelPreview = () => (
        <p className="channel-preview__item">
            {channel?.data?.name && (
                <MuiAvatar
                    className="mr-3"
                    style={{ fontSize: '.65rem' }}
                    {...stringAvatar(channel?.data?.name)}
                ></MuiAvatar>
            )}
            {channel?.data?.name || channel?.data?.id}
        </p>
    );
    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(
            ({ user }) => user.id !== client.userID
        );

        return (
            <div className={`channel-preview__item single flex`}>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.name || members[0]?.user?.fullName}
                    size={24}
                />
                <span className="flex items-center">
                    <p>
                        {members[0]?.user?.name || members[0]?.user?.fullName}
                    </p>
                </span>

                {/* <div className='flex justify-end items-center'>
                    {unreadMsgs.id === members[0]?.user?.id ? (
                        <Badge badgeContent={unreadMsgs.count} color='primary'>
                            <MessageIcon color='action' />
                        </Badge>
                    ) : (
                        <Badge badgeContent={0} color='primary'>
                            <MessageIcon color='action' />
                        </Badge>
                    )}
                </div> */}
            </div>
        );
    };

    return (
        <>
            <div
                className={
                    channel?.id === activeChannel?.id
                        ? 'channel-preview__wrapper__selected'
                        : `channel-preview__wrapper ${width < 768 && 'my-2'}`
                }
                onClick={() => {
                    if (width < 768) {
                        handleAppbarChange('_', 2);
                    }
                    setIsCreating(false);
                    setIsEditing(false);
                    setActiveChannel(channel);
                    if (setToggleContainer) {
                        setToggleContainer((prevState) => !prevState);
                    }
                }}
            >
                {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
            </div>
        </>
    );
};

export default TeamChannelPreview;
