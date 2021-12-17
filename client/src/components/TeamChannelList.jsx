import {
    Avatar,
    CircularProgress,
    Dialog,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import React from 'react';
import { ErrorHandler } from '.';
import { AddChannel } from '../assests';
import useWindowDimensions from '../hooks/use-window-dimensions';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TeamChannelList = ({
    children,
    error = false,
    loading,
    type,
    setCreateType,
    isCreating,
    setIsCreating,
    setIsEditing,
    setToggleContainer,
    handleAppbarChange,
}) => {
    // eslint-disable-next-line no-unused-vars
    const { width, height } = useWindowDimensions();
    const [open, setOpen] = React.useState(false);

    if (error) {
        return type === 'team' ? (
            <ErrorHandler
                type={1}
                msg="Connection error, please wait a moment and try again"
            />
        ) : null;
    }

    if (loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading flex items-center">
                    Loading {type === 'team' ? 'Channels' : 'Messages'}
                    <CircularProgress size={20} className="ml-2" />
                </p>
            </div>
        );
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function SimpleDialog(props) {
        const { onClose, selectedValue, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };

        return (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>
                    {type === 'team' ? 'Create Channel' : 'Direct Message'}
                </DialogTitle>{' '}
                <hr />
                <List sx={{ pt: 0 }}>
                    <ListItem
                        autoFocus
                        button
                        onClick={() => {
                            if (width < 768) {
                                handleAppbarChange('_', 2);
                            }
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <AddChannel
                                    setCreateType={setCreateType}
                                    isCreating={isCreating}
                                    setIsCreating={setIsCreating}
                                    setIsEditing={setIsEditing}
                                    type={
                                        type === 'team' ? 'team' : 'messaging'
                                    }
                                    setToggleContainer={setToggleContainer}
                                />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                type === 'team'
                                    ? 'Create Channel'
                                    : 'Add Friend'
                            }
                        />
                    </ListItem>
                </List>
            </Dialog>
        );
    }

    return (
        <div className="team-channel-list pb-12">
            <div className="team-channel-list__header my-3">
                {width > 768 ? (
                    <>
                        <p className="team-channel-list__header__title">
                            {type === 'team' ? 'Channels' : 'Driect Messages'}
                        </p>
                        <AddChannel
                            setCreateType={setCreateType}
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            type={type === 'team' ? 'team' : 'messaging'}
                            setToggleContainer={setToggleContainer}
                        />
                    </>
                ) : (
                    <>
                        <p className="team-channel-list__header__title">
                            {type === 'team' ? 'Create Channels' : 'Add Friend'}
                        </p>
                        <IconButton
                            variant="outlined"
                            onClick={handleClickOpen}
                        >
                            <MoreVertIcon className="text-white" />
                        </IconButton>
                        <SimpleDialog open={open} onClose={handleClose} />
                    </>
                )}
            </div>
            {children}
        </div>
    );
};

export default TeamChannelList;
