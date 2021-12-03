import { useChannelStateContext, useChatContext, useTypingContext } from "stream-chat-react";

 const CustomTypingIndicator = (props) => {
    const { threadList } = props;
  
    const { channelConfig, thread } = useChannelStateContext();
    const { client } = useChatContext();
    const { typing = {} } = useTypingContext();
  
    if (channelConfig?.typing_events === false) {
      return null;
    }
  
    const typingInChannel = !threadList
      ? Object.values(typing).filter(
          ({ parent_id, user }) => user?.id !== client.user?.id && !parent_id,
        )
      : [];
  
    const typingInThread = threadList
      ? Object.values(typing).filter(
          ({ parent_id, user }) => user?.id !== client.user?.id && parent_id === thread?.id,
        )
      : [];
  
    return (
      <div
        className={`str-chat__typing-indicator ${
          (threadList && typingInThread.length) || (!threadList && typingInChannel.length)
            ? 'str-chat__typing-indicator--typing'
            : ''
        }`}
      >
        <div className='str-chat__typing-indicator__avatars'>
          {(threadList ? typingInThread : typingInChannel).map(({ user }, i) => (
            <div className='username'>
              <div className='typing-indicator-name'>{user?.name}</div>
              <div className='typing-indicator-role '>{user?.role}</div>
            </div>
          ))}
        </div>
        <div className='str-chat__typing-indicator__dots'>
          <div className='str-chat__typing-indicator__dot' />
          <div className='str-chat__typing-indicator__dot' />
          <div className='str-chat__typing-indicator__dot' />
        </div>
      </div>
    );
  };

  export default CustomTypingIndicator