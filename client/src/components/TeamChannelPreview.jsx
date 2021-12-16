import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({
    channel,
    type,
    setToggleContainer,
    setIsCreating,
    setIsEditing,
    setActiveChannel,
}) => {
    const { channe: activeChannel, client } = useChatContext();

    const ChannelPreview = () => (
        <p className="channel-preview__item">
            # {channel?.data?.name || channel?.data?.id}
        </p>
    );
    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(
            ({ user }) => user.id !== client.userID
        );

        return (
            <div className="channel-preview__item single flex">
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
            </div>
        );
    };

    return (
        <>
            <div
                className={
                    channel?.id === activeChannel?.id
                        ? 'channel-preview__wrapper__selected'
                        : 'channel-preview__wrapper'
                }
                onClick={() => {
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
