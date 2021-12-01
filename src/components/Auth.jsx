import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { ThemeSwitch } from '.';

const Auth = ({ setMode, mode, setIsModeChanged }) => {
    const [isSignup, setIsSignup] = useState(false);

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields channel-list__sidebar dark:bg-gray-800'>
                <div className='flex justify-end'>
                    <ThemeSwitch
                        setMode={setMode}
                        setIsModeChanged={setIsModeChanged}
                        mode={mode}
                    />
                </div>
                <div className='auth__form-container_fields-content dark:bg-gray-700'>
                    <p className='dark:text-gray-300'>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
