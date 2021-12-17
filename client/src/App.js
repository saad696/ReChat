/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookie from 'universal-cookie';
import {
    Auth,
    ChannelContainer,
    ChannelListContainer,
    MyProfile,
} from './components';
// import axios from 'axios';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

import {
    BottomNavigation,
    BottomNavigationAction,
    createTheme,
    Paper,
    ThemeProvider,
} from '@mui/material';
// import { getBrowser } from './utilities/getBrowser';
// import { storeDataToDB } from './utilities/storeData';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChatIcon from '@mui/icons-material/Chat';
import useWindowDimensions from './hooks/use-window-dimensions';

require('dotenv').config();
const cookies = new Cookie();
const API_KEY = process.env.REACT_APP_STREAM_API_KEY;
const authToken = cookies.get('token');
const client = StreamChat.getInstance(API_KEY);

if (authToken) {
    try {
        client.connectUser(
            {
                id: cookies.get('userId'),
                name: cookies.get('userName'),
                fullName: cookies.get('fullName'),
                image: `https://getstream.io/random_svg/?name=${cookies.get(
                    'userName'
                )}`,
                hashedPassword: cookies.get('hashedPassword'),
                phoneNumber: cookies.get('phoneNumber'),
            },
            authToken
        );
    } catch (error) {
        console.log(error);
    }
}

function App() {
    // eslint-disable-next-line no-unused-vars
    const MODE = localStorage.getItem('mode');
    // eslint-disable-next-line no-unused-vars
    const [reRender, setReRender] = useState(null);
    const [mode, setMode] = useState();
    const { width, height } = useWindowDimensions();

    // MODE === false || MODE == '' || MODE == null
    //     ? window.matchMedia('(prefers-color-scheme: dark)').matches
    //         ? 'dark'
    //         : 'light'
    //     : MODE
    const [isModeChanged, setIsModeChanged] = useState(null);
    const [appbarValue, setAppbarValue] = useState(null);
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isGroupVisible, setIsGroupVisible] = useState(true);
    const [isDMVisible, setIsDMVisible] = useState(false);
    const [isMessagesVisible, setIsMessagesVisible] = useState(false);
    const [isAllVisible, setIsAllVisible] = useState(false);
    // useEffect(async () => {
    //     if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    //         return;
    //     } else {
    //         let userDetails = {};
    //         const userBrowser = getBrowser();
    //         const { data } = await axios.get(
    //             'https://find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com/iplocation',
    //             {
    //                 params: { apikey: '873dbe322aea47f89dcf729dcc8f60e8' },
    //                 headers: {
    //                     'x-rapidapi-host':
    //                         'find-any-ip-address-or-domain-location-world-wide.p.rapidapi.com',
    //                     'x-rapidapi-key':
    //                         '681a1480a3mshf9e800a7f1e01d3p1ab23djsn0f5741ea1530',
    //                 },
    //             }
    //         );

    //         userDetails = {
    //             userId: cookies.get('userId'),
    //             name: cookies.get('userName'),
    //             fullName: cookies.get('fullName'),
    //             userBrowser: userBrowser,
    //             ip: data.ip,
    //             location: {
    //                 continent: data.continent,
    //                 country: data.country,
    //                 state: data.state,
    //                 city: data.city,
    //                 lat: data.latitude,
    //                 long: data.longitude,
    //                 zipCode: data.zipCode,
    //             },
    //             timeZone: data.timezone,
    //             network: data.network,
    //             languages: data.languages,
    //             visited: 1,
    //         };

    //         storeDataToDB(userDetails);
    //     }
    // }, []);

    const handleAppbarChange = (event, value) => {
        setAppbarValue(value);
        switch (value) {
            case 0:
                setIsDMVisible(false);
                setIsGroupVisible(false);
                setIsMessagesVisible(false);
                setIsProfileVisible(true);
                break;
            case 1:
                setIsDMVisible(false);
                setIsGroupVisible(true);
                setIsMessagesVisible(false);
                setIsProfileVisible(false);
                break;
            case 2:
                setIsDMVisible(false);
                setIsGroupVisible(false);
                setIsMessagesVisible(true);
                setIsProfileVisible(false);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (width > 768) {
            setIsAllVisible(true);
        } else {
            setIsAllVisible(false);
        }
    }, [width]);

    useEffect(() => {
        if (isModeChanged !== null) {
            localStorage.setItem('mode', mode);
        }
    }, [isModeChanged]);

    useEffect(() => {
        setReRender(Math.random());
    }, [mode]);

    return (
        <ThemeProvider theme={theme}>
            {authToken ? (
                <div className={`app__wrapper ${mode}`}>
                    <Chat
                        client={client}
                        darkMode={mode === 'dark' ? true : ''}
                    >
                        {width < 768 && isGroupVisible && (
                            <ChannelListContainer
                                setMode={setMode}
                                setIsModeChanged={setIsModeChanged}
                                mode={mode}
                                setCreateType={setCreateType}
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                setIsEditing={setIsEditing}
                                handleAppbarChange={handleAppbarChange}
                            />
                        )}
                        {isAllVisible && (
                            <ChannelListContainer
                                setMode={setMode}
                                setIsModeChanged={setIsModeChanged}
                                mode={mode}
                                setCreateType={setCreateType}
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                setIsEditing={setIsEditing}
                                handleAppbarChange={handleAppbarChange}
                            />
                        )}
                        {width < 768 && isMessagesVisible && (
                            <ChannelContainer
                                isEditing={isEditing}
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                setIsEditing={setIsEditing}
                                createType={createType}
                                handleAppbarChange={handleAppbarChange}
                            />
                        )}
                        {isAllVisible && (
                            <ChannelContainer
                                isEditing={isEditing}
                                isCreating={isCreating}
                                setIsCreating={setIsCreating}
                                setIsEditing={setIsEditing}
                                createType={createType}
                                handleAppbarChange={handleAppbarChange}
                            />
                        )}
                        {width < 768 && isProfileVisible && <MyProfile />}
                        {width < 768 && !isMessagesVisible && (
                            <Paper
                                sx={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    zIndex: 9999999999,
                                }}
                                elevation={3}
                            >
                                <BottomNavigation
                                    showLabels
                                    value={
                                        appbarValue === null ? 1 : appbarValue
                                    }
                                    onChange={(event, newValue) => {
                                        handleAppbarChange(event, newValue);
                                    }}
                                >
                                    <BottomNavigationAction
                                        label="My Profile"
                                        icon={<AccountCircleIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chats List"
                                        icon={<ViewListIcon />}
                                    />
                                    <BottomNavigationAction
                                        label="Chat"
                                        icon={<ChatIcon />}
                                    />
                                </BottomNavigation>
                            </Paper>
                        )}
                    </Chat>
                </div>
            ) : (
                <div className={mode}>
                    <Auth
                        setMode={setMode}
                        setIsModeChanged={setIsModeChanged}
                        mode={mode}
                    />
                </div>
            )}
        </ThemeProvider>
    );
}

export default App;
