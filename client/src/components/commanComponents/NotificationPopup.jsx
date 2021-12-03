import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const NotificationPopup = ({ showPopup, setShowPopup, message, Type, duration }) => {
    const handleClose = () => {
        setShowPopup(false);
    };

    const [type, setType] = useState('');

    useEffect(() => {
        if (Type === 1) {
            setType('error');
        } else if (Type === 2) {
            setType('warning');
        } else if (Type === 3) {
            setType('info');
        } else {
            setType('success');
        }
    }, [type]);

    return (
        <>
            <Snackbar
                open={showPopup}
                onClose={handleClose}
                autoHideDuration={duration}
                key={Math.random()}
            >
                <Alert onClose={handleClose} severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationPopup;
