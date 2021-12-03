import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { ThemeSwitch } from '.';
import {
    TextField,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    FormControl,
    OutlinedInput,
    Typography,
    Button,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    userName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '',
};

const Auth = ({ setMode, mode, setIsModeChanged }) => {
    const [isSignup, setIsSignup] = useState(true);
    const [form, setForm] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userName, password, phoneNumber, avatarUrl } = form;

        const URL = 'http://localhost:5000/auth';
        const {
            data: { token, userId, hashedPassword, fullName },
        } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            userName,
            password,
            fullName: form.fullName,
            avatarUrl,
            phoneNumber,
        });

        cookies.set('token', token);
        cookies.set('userName', userName);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if (isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarUrl', avatarUrl);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();
    };

    const swicthMode = () => {
        setIsSignup((prevState) => !prevState);
    };

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields channel-list__sidebar dark:bg-gray-800 w-screen'>
                <Grid container spacing={1} justifyContent='center'>
                    <Grid xs={12} md={6}>
                        <Typography
                            variant='h2'
                            className='font-extrabold pb-4 dark:text-blue-800 text-gray-300'
                        >
                            Welcome to ReChat
                        </Typography>
                        <div className='flex justify-end'>
                            <ThemeSwitch
                                setMode={setMode}
                                setIsModeChanged={setIsModeChanged}
                                mode={mode}
                            />
                        </div>
                        <div className='auth__form-container_fields-content dark:bg-gray-700 shadow-lg'>
                            <p className='dark:text-gray-300'>
                                {isSignup ? 'Sign Up' : 'Sign In'}
                                <form onSubmit={handleSubmit}>
                                    <div className='mt-4'>
                                        <Grid container spacing={2}>
                                            {isSignup && (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className='pb-3'
                                                >
                                                    <TextField
                                                        name='fullName'
                                                        id='fullName'
                                                        label='Full Name'
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        size='small'
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12} className='pb-3'>
                                                <TextField
                                                    name='userName'
                                                    id='userName'
                                                    label='User Name'
                                                    variant='outlined'
                                                    onChange={handleChange}
                                                    size='small'
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            {isSignup && (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className='pb-3'
                                                >
                                                    <TextField
                                                        name='phoneNumber'
                                                        id='phoneNumber'
                                                        label='Phone Number'
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        type='number'
                                                        size='small'
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                            )}

                                            {isSignup && (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className='pb-3'
                                                >
                                                    <TextField
                                                        name='avatarUrl'
                                                        id='avatarUrl'
                                                        label='Avatar URL'
                                                        variant='outlined'
                                                        onChange={handleChange}
                                                        size='small'
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                            )}

                                            <Grid item xs={12} className='pb-3'>
                                                <FormControl
                                                    required
                                                    fullWidth
                                                    size='small'
                                                    variant='outlined'
                                                >
                                                    <InputLabel htmlFor='outlined-adornment-password'>
                                                        Password
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        name='password'
                                                        id='outlined-adornment-password'
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        // value={
                                                        //     values.password
                                                        // }
                                                        onChange={handleChange}
                                                        endAdornment={
                                                            <InputAdornment position='end'>
                                                                <IconButton
                                                                    aria-label='toggle password visibility'
                                                                    onClick={
                                                                        handleClickShowPassword
                                                                    }
                                                                    edge='end'
                                                                >
                                                                    {showPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label='Password'
                                                    />
                                                </FormControl>
                                            </Grid>
                                            {isSignup && (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    className='pb-3'
                                                >
                                                    <FormControl
                                                        required
                                                        fullWidth
                                                        size='small'
                                                        variant='outlined'
                                                    >
                                                        <InputLabel htmlFor='outlined-adornment-confirm-password'>
                                                            Confrim Password
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            name='confirmPassword'
                                                            id='outlined-adornment-confirm-password'
                                                            type={
                                                                showPassword
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            // value={
                                                            //     values.password
                                                            // }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            endAdornment={
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        aria-label='toggle password visibility'
                                                                        onClick={
                                                                            handleClickShowPassword
                                                                        }
                                                                        edge='end'
                                                                    >
                                                                        {showPassword ? (
                                                                            <VisibilityOff />
                                                                        ) : (
                                                                            <Visibility />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            label='Confirm Password'
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </div>

                                    <Button
                                        type='submit'
                                        variant={
                                            mode === 'dark'
                                                ? 'outlined'
                                                : 'contained'
                                        }
                                    >
                                        {isSignup ? 'Sign In' : 'Sign Up'}
                                    </Button>
                                </form>
                                <div className='auth__form-container_fields-account mt-3'>
                                    <p className='dark:text-gray-400'>
                                        {isSignup
                                            ? 'Already have an account?'
                                            : "Dont't have an account?"}
                                        <span
                                            onClick={swicthMode}
                                            className='ml-1 dark:text-blue-500 dark:hover:text-blue-700 underline'
                                        >
                                            {isSignup ? 'Sign In' : 'Sign Up'}
                                        </span>
                                    </p>
                                </div>
                            </p>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Auth;
