import React, { createContext, useContext, useState } from 'react';

interface IntroContextType {
    introFinished: boolean;
    setIntroFinished: (finished: boolean) => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [introFinished, setIntroFinished] = useState(false);

    return (
        <IntroContext.Provider value={{ introFinished, setIntroFinished }}>
            {children}
        </IntroContext.Provider>
    );
};

export const useIntro = () => {
    const context = useContext(IntroContext);
    if (context === undefined) {
        throw new Error('useIntro must be used within an IntroProvider');
    }
    return context;
};
