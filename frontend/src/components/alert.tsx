import React from 'react';

interface AlertProps {
    type: 'success' | 'error';
    message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const baseClasses = 'rounded-lg border px-4 py-2 text-sm shadow-sm';
    
    const classes = type === 'success'
        ? `${baseClasses} border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700 text-green-800 dark:text-green-300`
        : `${baseClasses} border-red-300 bg-red-50 dark:bg-red-900/30 dark:border-red-700 text-red-800 dark:text-red-300`;

    return (
        <div className={classes}>
            {message}
        </div>
    );
};


