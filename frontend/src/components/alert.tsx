import React from 'react';

interface AlertProps {
    type: 'success' | 'error';
    message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const baseClasses = 'rounded-lg border px-4 py-2 text-sm shadow-sm';

    const classes = type === 'success'
        ? `${baseClasses} border-green-300 bg-green-50 text-green-800`
        : `${baseClasses} border-red-300 bg-red-50 text-red-800`;

    return (
        <div className={classes}>
            {message}
        </div>
    );
};


