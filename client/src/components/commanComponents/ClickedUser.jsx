import { Button, Drawer, Tooltip } from '@mui/material';
import { Avatar, useChatContext } from 'stream-chat-react';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import { useState } from 'react';

const ClickedUser = ({ clickedUser, setClickedUser, title, type }) => {
    const defautFontSize = { fontSize: 14 };
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([
        client.userID || '',
        type === 'from-channel' ? clickedUser.user_id : clickedUser.id,
    ]);

    const getCurrentWeek = () => {
        var currentDate = moment();

        var weekStart = currentDate.clone().startOf('isoweek');

        var days = [];

        for (var i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, 'days').format('YYYY-MM-DD'));
        }

        if (
            days.includes(
                moment(
                    type === 'from-channel'
                        ? clickedUser.user.last_active
                        : clickedUser.last_active
                ).format('YYYY-MM-DD')
            )
        ) {
            return true;
        } else {
            return false;
        }
    };

    const lastSeen = () => {
        if (
            moment().format('YYYY-MM-DD') ===
            moment(
                type === 'from-channel'
                    ? clickedUser.user.last_active
                    : clickedUser.last_active
            ).format('YYYY-MM-DD')
        ) {
            return (
                'Today at' +
                ' ' +
                moment(
                    type === 'from-channel'
                        ? clickedUser.user.last_active
                        : clickedUser.last_active
                ).format('hh:mm a')
            );
        } else if (getCurrentWeek()) {
            return moment(
                type === 'from-channel'
                    ? clickedUser.user.last_active
                    : clickedUser.last_active
            ).format('dddd');
        } else {
            return moment(
                type === 'from-channel'
                    ? clickedUser.user.last_active
                    : clickedUser.last_active
            ).format('Do MMMM');
        }
    };

    const directMessage = async () => {
        const newChannel = await client.channel('messaging', '', {
            name: '',
            members: selectedUsers,
        });
        await newChannel.watch();
        setActiveChannel(newChannel);
        setClickedUser(undefined);
    };

    return (
        <Drawer
            anchor={'right'}
            open={clickedUser}
            onClose={() => setClickedUser(undefined)}
        >
            <div className='ml-2 mb-2 font-bold text-white'>{title}</div> <hr />
            <div className='inner flex justify-center px-10'>
                {type === 'from-channel' ? (
                    <Avatar image={clickedUser?.user.image} size={140} />
                ) : (
                    <Avatar image={clickedUser?.image} size={140} />
                )}
                <div>
                    <div className='name justify-center' style={defautFontSize}>
                        Name:{' '}
                        {
                            <p style={defautFontSize}>
                                {type === 'from-channel'
                                    ? clickedUser.user.name
                                    : clickedUser.name}
                            </p>
                        }{' '}
                        <div>
                            {(
                                type === 'from-channel'
                                    ? clickedUser.user.online
                                    : clickedUser.online
                            ) ? (
                                <Tooltip title='Online'>
                                    <div className='online w-2 h-2 bg-green-600 rounded'></div>
                                </Tooltip>
                            ) : (
                                <Tooltip title={`Last seen: ${lastSeen()}`}>
                                    <div className='offline w-2 h-2 bg-gray-400 rounded'></div>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div className='role justify-center' style={defautFontSize}>
                        Role:{' '}
                        {
                            <p style={defautFontSize}>
                                {type === 'from-channel'
                                    ? clickedUser.user.role
                                    : clickedUser.role}
                            </p>
                        }
                    </div>
                    <div className='id justify-center' style={defautFontSize}>
                        {!clickedUser.user.online && (
                            <>
                                <p>Last Seen: </p>
                                <p className='text-gray-300'>{lastSeen()}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <Button
                    endIcon={<SendIcon />}
                    variant='contained'
                    size='small'
                    className='w-50'
                    onClick={directMessage}
                >
                    Direct Message
                </Button>
            </div>
        </Drawer>
    );
};

export default ClickedUser;
