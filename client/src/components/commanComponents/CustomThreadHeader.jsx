import { Avatar } from "stream-chat-react";

const CustomThreadHeader = ({ closeThread, thread }) => {
    const replyCount = thread.reply_count;
    const threadParticipants = thread.thread_participants;
  
    return (
      <div className='wrapper'>
        <div className='participants-wrapper'>
          {threadParticipants.map((participant) => (
            <div className='participant'>
              <Avatar image={participant.image} name={participant.name} />
            </div>
          ))}
          <div className='reply-count' style={{ fontSize: 14 }}>{replyCount} Replies</div>
        </div>
        <div onClick={(event) => closeThread(event)} className='close-button mr-4'>
          <div className='left'>
            <div className='right'></div>
          </div>
        </div>
      </div>
    );
  };

  export default CustomThreadHeader