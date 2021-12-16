import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

import { Menu, Tooltip } from '@mui/material';
import moment from 'moment';
import { ClickedUser } from '..';
import { Avatar } from 'stream-chat-react';

export default function UsersMenu({
    isOpen,
    handleClose,
    anchorRef,
    channelMembers,
}) {
    const [clickedUser, setClickedUser] = React.useState(null);
    const onUserClick = (member) => {
        setClickedUser(member);
    };

    const openUserDrawer = () => {
        handleClose();
        return (
            <ClickedUser
                setClickedUser={setClickedUser}
                clickedUser={clickedUser}
                title="Team member"
                type="from-channel"
            />
        );
    };

    return (
        <>
            <Menu
                id="user-menu"
                anchorEl={anchorRef}
                open={isOpen}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {channelMembers?.map((member) => {
                    const getCurrentWeek = () => {
                        var currentDate = moment();

                        var weekStart = currentDate.clone().startOf('isoweek');

                        var days = [];

                        for (var i = 0; i <= 6; i++) {
                            days.push(
                                moment(weekStart)
                                    .add(i, 'days')
                                    .format('YYYY-MM-DD')
                            );
                        }

                        if (
                            days.includes(
                                moment(member.user.last_active).format(
                                    'YYYY-MM-DD'
                                )
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
                            moment(member.user.last_active).format('YYYY-MM-DD')
                        ) {
                            return (
                                'Today at' +
                                ' ' +
                                moment(member.user.last_active).format(
                                    'hh:mm a'
                                )
                            );
                        } else if (getCurrentWeek()) {
                            return moment(member.user.last_active).format(
                                'dddd'
                            );
                        } else {
                            return moment(member.user.last_active).format(
                                'Do MMMM'
                            );
                        }
                    };
                    return (
                        <MenuItem
                            className="block"
                            key={member.id}
                            onClick={() => {
                                onUserClick(member);
                            }}
                        >
                            <span className="flex w-100">
                                <Tooltip
                                    title={
                                        !member?.user.online
                                            ? `Last seen: ${lastSeen()}`
                                            : 'online'
                                    }
                                >
                                    <Avatar
                                        image={member.user.image}
                                        name={
                                            member.user.name ||
                                            member.user.fullName
                                        }
                                    />
                                </Tooltip>
                                <span className="flex items-center">
                                    <p className="text-black font-bold">
                                        {member.user.name}
                                    </p>
                                    {member.user.online ? (
                                        <div className="online w-2 h-2 bg-green-600 rounded ml-2"></div>
                                    ) : (
                                        <div className="offline w-2 h-2 bg-gray-400 rounded ml-2"></div>
                                    )}
                                </span>
                            </span>{' '}
                        </MenuItem>
                    );
                })}
            </Menu>

            {clickedUser && openUserDrawer()}
        </>
    );
}
