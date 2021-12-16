import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth';
import { NotificationPopup, ThemeSwitch } from '.';
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
    const [msg, setMsg] = useState(0);
    const [OTPsend, setOTPsend] = useState(false);
    const [validationErr, setValidationErr] = useState(0);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const configureCaptcha = () => {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier(
            'sign-in-button',
            {
                size: 'invisible',
                // eslint-disable-next-line no-unused-vars
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    handleSubmit();
                },
                defaultCountry: 'IN',
            },
            auth
        );
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (isSignup && form.password !== form.confirmPassword) {
            setValidationErr(4);
        } else if (isSignup && form.phoneNumber.length > 10) {
            setValidationErr(3);
        } else {
            setValidationErr(0);
            if (isSignup) {
                configureCaptcha();
                const { phoneNumber } = form;

                const _phoneNumber = `+91${phoneNumber}`;
                const appVerifier = window.recaptchaVerifier;

                const auth = getAuth();
                signInWithPhoneNumber(auth, _phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        window.confirmationResult = confirmationResult;
                        setMsg(1);
                        setOTPsend(true);

                        // ...
                    })
                    .catch(() => {
                        setMsg(2);
                        setOTPsend(false);
                    });
            } else {
                // for login
                try {
                    const { userName, password, phoneNumber } = form;
                    const URL = 'https://re-chatt.herokuapp.com/auth';
                    const {
                        data: { token, userId, hashedPassword, fullName },
                    } = await axios.post(`${URL}/${'login'}`, {
                        userName,
                        password,
                        fullName: form.fullName,
                        phoneNumber,
                    });

                    cookies.set('token', token);
                    cookies.set('userName', userName);
                    cookies.set('fullName', fullName);
                    cookies.set('userId', userId);

                    if (isSignup) {
                        cookies.set('phoneNumber', phoneNumber);
                        cookies.set('hashedPassword', hashedPassword);
                    }

                    window.location.reload();
                } catch (error) {
                    setMsg(4);
                }
            }
        }
    };

    const onVerifyOTP = (e) => {
        e?.preventDefault();
        const code = form.otp;
        window.confirmationResult
            .confirm(code)
            .then(async (result) => {
                // for sign up
                // User signed in successfully.
                // eslint-disable-next-line no-unused-vars
                const user = result.user;
                const { userName, password, phoneNumber } = form;
                const URL = 'https://re-chatt.herokuapp.com/auth';
                const {
                    data: { token, userId, hashedPassword, fullName },
                } = await axios.post(`${URL}/${'signup'}`, {
                    userName,
                    password,
                    fullName: form.fullName,
                    phoneNumber,
                });

                cookies.set('token', token);
                cookies.set('userName', userName);
                cookies.set('fullName', fullName);
                cookies.set('userId', userId);

                if (isSignup) {
                    cookies.set('phoneNumber', phoneNumber);
                    cookies.set('hashedPassword', hashedPassword);
                }

                window.location.reload();
            })
            .catch(() => {
                setMsg(3);
            });
    };

    const swicthMode = () => {
        setIsSignup((prevState) => !prevState);
        setForm(initialState);
    };

    return (
        <>
            {msg === 1 && (
                <NotificationPopup
                    message="OTP has been send to your entered mobile number"
                    setMultipleErrorType={setMsg}
                    showPopup={msg}
                    duration={4000}
                    Type={4}
                />
            )}
            {msg === 2 && (
                <NotificationPopup
                    message="Something went wrong please check if entered mobile number is correct."
                    setMultipleErrorType={setMsg}
                    showPopup={msg}
                    duration={4000}
                    Type={1}
                />
            )}
            {msg === 3 && (
                <NotificationPopup
                    message="The entered OTP is not correct."
                    setMultipleErrorType={setMsg}
                    showPopup={msg}
                    duration={4000}
                    Type={1}
                />
            )}
            {msg === 4 && (
                <NotificationPopup
                    message="Entered username and password does not match."
                    setMultipleErrorType={setMsg}
                    showPopup={msg}
                    duration={4000}
                    Type={1}
                />
            )}
            <div className="auth__form-container">
                <div className="auth__form-container_fields channel-list__sidebar dark:bg-gray-800 w-screen">
                    <Grid container spacing={1} justifyContent="center">
                        <Grid xs={12} md={6}>
                            <Typography
                                variant="h2"
                                className="font-extrabold pb-4 dark:text-blue-800 text-gray-300"
                            >
                                Welcome to ReChat
                            </Typography>
                            <div className="flex justify-end">
                                <ThemeSwitch
                                    setMode={setMode}
                                    setIsModeChanged={setIsModeChanged}
                                    mode={mode}
                                />
                            </div>
                            <div className="auth__form-container_fields-content dark:bg-gray-700 shadow-lg">
                                <p className="dark:text-gray-300">
                                    <div className="flex justify-between">
                                        <Button
                                            onClick={() => {
                                                setIsSignup(true);
                                                setForm(initialState);
                                            }}
                                            variant="text"
                                            size="large"
                                            fullWidth
                                        >
                                            <span className="font-bold">
                                                Sign Up
                                            </span>
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsSignup(false);
                                                setForm(initialState);
                                            }}
                                            variant="text"
                                            size="large"
                                            fullWidth
                                        >
                                            <span className="font-bold">
                                                Sign In
                                            </span>
                                        </Button>
                                    </div>
                                    {!OTPsend && (
                                        <form onSubmit={handleSubmit}>
                                            <div id="sign-in-button"></div>
                                            <div className="mt-4">
                                                <Grid container spacing={2}>
                                                    {isSignup && (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className="pb-3"
                                                        >
                                                            <TextField
                                                                name="fullName"
                                                                id="fullName"
                                                                label="Full Name"
                                                                variant="outlined"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                value={
                                                                    form.fullName
                                                                }
                                                                size="small"
                                                                fullWidth
                                                                required
                                                            />
                                                        </Grid>
                                                    )}
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className="pb-3"
                                                    >
                                                        <TextField
                                                            name="userName"
                                                            id="userName"
                                                            label="User Name"
                                                            variant="outlined"
                                                            onChange={
                                                                handleChange
                                                            }
                                                            size="small"
                                                            value={
                                                                form.userName
                                                            }
                                                            error={
                                                                msg === 4
                                                                    ? true
                                                                    : false
                                                            }
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    {isSignup && (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className="pb-3"
                                                        >
                                                            <TextField
                                                                name="phoneNumber"
                                                                id="phoneNumber"
                                                                label="Phone Number"
                                                                variant="outlined"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                type="number"
                                                                size="small"
                                                                error={
                                                                    validationErr ===
                                                                    3
                                                                        ? true
                                                                        : false
                                                                }
                                                                helperText={
                                                                    validationErr ===
                                                                        3 && (
                                                                        <small className="text-red-600 text-xs font-extralight">
                                                                            Mobile
                                                                            number
                                                                            should
                                                                            be
                                                                            greater
                                                                            than
                                                                            10
                                                                            digits.
                                                                        </small>
                                                                    )
                                                                }
                                                                fullWidth
                                                                required
                                                            />
                                                        </Grid>
                                                    )}

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        className="pb-3"
                                                    >
                                                        <FormControl
                                                            required
                                                            fullWidth
                                                            size="small"
                                                            variant="outlined"
                                                            error={
                                                                validationErr ===
                                                                4
                                                                    ? true
                                                                    : msg === 4
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <InputLabel htmlFor="outlined-adornment-password">
                                                                Password
                                                            </InputLabel>
                                                            <OutlinedInput
                                                                value={
                                                                    form.password
                                                                }
                                                                name="password"
                                                                id="outlined-adornment-password"
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                endAdornment={
                                                                    <InputAdornment position="end">
                                                                        <IconButton
                                                                            aria-label="toggle password visibility"
                                                                            onClick={
                                                                                handleClickShowPassword
                                                                            }
                                                                            edge="end"
                                                                        >
                                                                            {showPassword ? (
                                                                                <VisibilityOff />
                                                                            ) : (
                                                                                <Visibility />
                                                                            )}
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                }
                                                                label="Password"
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    {isSignup && (
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            className="pb-3"
                                                        >
                                                            <FormControl
                                                                required
                                                                fullWidth
                                                                size="small"
                                                                variant="outlined"
                                                                error={
                                                                    validationErr ===
                                                                    4
                                                                        ? true
                                                                        : false
                                                                }
                                                            >
                                                                <InputLabel htmlFor="outlined-adornment-confirm-password">
                                                                    Confrim
                                                                    Password
                                                                </InputLabel>
                                                                <OutlinedInput
                                                                    name="confirmPassword"
                                                                    id="outlined-adornment-confirm-password"
                                                                    type={
                                                                        showPassword
                                                                            ? 'text'
                                                                            : 'password'
                                                                    }
                                                                    value={
                                                                        form.confirmPassword
                                                                    }
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    endAdornment={
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                aria-label="toggle password visibility"
                                                                                onClick={
                                                                                    handleClickShowPassword
                                                                                }
                                                                                edge="end"
                                                                            >
                                                                                {showPassword ? (
                                                                                    <VisibilityOff />
                                                                                ) : (
                                                                                    <Visibility />
                                                                                )}
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    }
                                                                    label="Confirm Password"
                                                                />
                                                            </FormControl>
                                                            {validationErr ===
                                                                4 && (
                                                                <small className="text-red-600 text-xs font-extralight">
                                                                    Password and
                                                                    Confirm
                                                                    password
                                                                    doesn't
                                                                    match.
                                                                </small>
                                                            )}
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </div>

                                            <Button
                                                type="submit"
                                                variant={
                                                    mode === 'dark'
                                                        ? 'outlined'
                                                        : 'contained'
                                                }
                                            >
                                                {isSignup
                                                    ? 'Sign Up'
                                                    : 'Sign In'}
                                            </Button>
                                        </form>
                                    )}
                                    {OTPsend && (
                                        <form
                                            onSubmit={onVerifyOTP}
                                            className="mt-3"
                                        >
                                            <Grid item xs={12} className="pb-3">
                                                <TextField
                                                    name="otp"
                                                    id="otp"
                                                    label="Enter OTP"
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                    size="small"
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Button
                                                type="submit"
                                                variant={
                                                    mode === 'dark'
                                                        ? 'outlined'
                                                        : 'contained'
                                                }
                                            >
                                                Verify OTP
                                            </Button>
                                        </form>
                                    )}
                                    <div className="auth__form-container_fields-account mt-3">
                                        <p className="dark:text-gray-400">
                                            {isSignup
                                                ? 'Already have an account?'
                                                : "Dont't have an account?"}
                                            <span
                                                onClick={swicthMode}
                                                className="ml-1 dark:text-blue-500 dark:hover:text-blue-700 underline"
                                            >
                                                {isSignup
                                                    ? 'Sign Up'
                                                    : 'Sign In'}
                                            </span>
                                        </p>
                                    </div>
                                </p>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default Auth;
