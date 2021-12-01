import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookie from 'universal-cookie';
import { Auth, ChannelContainer, ChannelListContainer } from './components';
import axios from 'axios';

import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { getBrowser } from './utilities/getBrowser';
import { storeDataToDB } from './utilities/storeData';

require('dotenv').config();

function App() {
    const API_KEY = process.env.REACT_APP_STREAM_API_KEY;
    const client = StreamChat.getInstance(API_KEY);

    const MODE = localStorage.getItem('mode');
    const [mode, setMode] = useState(
        MODE === false || MODE == '' || MODE == null
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : MODE
    );
    const [isModeChanged, setIsModeChanged] = useState(null);
    const theme = createTheme({
        palette: {
            mode: mode,
            primary: {
                main: MODE === 'light' ? '#4a148c' : '#9a9a9a',
            },
            secondary: {
                main: '#1597BB',
            },
        },
    });

    const authToken = false;

    // useEffect(async () => {
    //     if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    //         return
    //     }
    //       else {
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
    //             userBrowser: userBrowser,
    //             ip: data.ip,
    //             location: {
    //                 continent: data.continent,
    //                 country: data.country,
    //                 state: data.state,
    //                 city: data.city,
    //                 lat: data.latitude,
    //                 long: data.longitude,
    //                 zipCode: data.zipCode
    //             },
    //             timeZone: data.timezone,
    //             network: data.network,
    //             languages: data.languages,
    //             visited: 1,
    //         };

    //         storeDataToDB(userDetails);
    //     }
    // }, []);

    useEffect(() => {
        if (isModeChanged !== null) {
            localStorage.setItem('mode', mode);
        }
    }, [isModeChanged]);

    return (
        <ThemeProvider theme={theme}>
            {authToken ? (
                <div className={`app__wrapper ${mode}`}>
                    <Chat client={client} darkMode={true} theme='team light'>
                        <ChannelListContainer
                            setMode={setMode}
                            setIsModeChanged={setIsModeChanged}
                            mode={mode}
                        />
                        <ChannelContainer />
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
