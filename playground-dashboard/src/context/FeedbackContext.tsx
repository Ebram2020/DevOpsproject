import React, { createContext, useState, ReactNode } from 'react';

interface FeedbackContextProps {
    displayedReviews: number;
    incrementReviews: () => void;
    resetReviews: () => void;
}

export const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [displayedReviews, setDisplayedReviews] = useState(10);

    const incrementReviews = () => {
        setDisplayedReviews((prev) => prev + 5);
    };

    const resetReviews = () => {
        setDisplayedReviews(10);
    };

    return (
        <FeedbackContext.Provider value={{ displayedReviews, incrementReviews, resetReviews }}>
            {children}
        </FeedbackContext.Provider>
    );
};
