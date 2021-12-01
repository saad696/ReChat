import { Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ErrorHandler = ({ type, msg }) => {
    // types - 1: error, 2: warning, 3: info, 4: success
    const [errorType, setErrorType] = useState(null);

    useEffect(() => {
        if (type === 1) {
            setErrorType('Error');
        } else if (type === 2) {
            setErrorType('Warning');
        } else if (type === 3) {
            setErrorType('Info');
        } else {
            setErrorType('Success');
        }
    }, [type]);

    return (
        <>
            <Alert severity={errorType}>{msg}</Alert>
        </>
    );
};

export default ErrorHandler;
