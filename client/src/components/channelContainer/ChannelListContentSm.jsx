import React from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from '..';
import { Box, Tab, Tabs, Typography } from '@mui/material';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ChannelListContentSm = ({
    setCreateType,
    isCreating,
    setIsCreating,
    setIsEditing,
    setToggleContainer,
    customChannelTeamFilter,
    customChannelMessagingFilter,
    handleAppbarChange,
}) => {
    const { client } = useChatContext();

    const filters = { members: { $in: [client.userID] } };

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="channel-list__list__wrapper dark:bg-gray-900">
                <ChannelSearch
                    handleAppbarChange={handleAppbarChange}
                    setToggleContainer={setToggleContainer}
                />
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            centered
                        >
                            <Tab
                                style={{ color: '#fff' }}
                                label="Direct Messages"
                                {...a11yProps(0)}
                            />
                            <Tab
                                style={{ color: '#fff' }}
                                label="Channels"
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <ChannelList
                            filters={filters}
                            channelRenderFilterFn={customChannelMessagingFilter}
                            List={(listProps) => (
                                <TeamChannelList
                                    {...listProps}
                                    type="messaging"
                                    setCreateType={setCreateType}
                                    isCreating={isCreating}
                                    setIsCreating={setIsCreating}
                                    setIsEditing={setIsEditing}
                                    setToggleContainer={setToggleContainer}
                                    handleAppbarChange={handleAppbarChange}
                                />
                            )}
                            Preview={(prevProps) => (
                                <TeamChannelPreview
                                    {...prevProps}
                                    type="messaging"
                                    setToggleContainer={setToggleContainer}
                                    setIsCreating={setIsCreating}
                                    setIsEditing={setIsEditing}
                                    handleAppbarChange={handleAppbarChange}
                                />
                            )}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ChannelList
                            filters={filters}
                            channelRenderFilterFn={customChannelTeamFilter}
                            List={(listProps) => (
                                <TeamChannelList
                                    {...listProps}
                                    type="team"
                                    setCreateType={setCreateType}
                                    isCreating={isCreating}
                                    setIsCreating={setIsCreating}
                                    setIsEditing={setIsEditing}
                                    setToggleContainer={setToggleContainer}
                                    handleAppbarChange={handleAppbarChange}
                                />
                            )}
                            Preview={(prevProps) => (
                                <TeamChannelPreview
                                    {...prevProps}
                                    type="team"
                                    setToggleContainer={setToggleContainer}
                                    setIsCreating={setIsCreating}
                                    setIsEditing={setIsEditing}
                                    handleAppbarChange={handleAppbarChange}
                                />
                            )}
                        />
                    </TabPanel>
                </Box>
            </div>
        </>
    );
};

export default ChannelListContentSm;
