import React from 'react';
import { Redirect } from 'react-router-dom';

interface Props {
    isSeasonEnd: boolean;
}

// Redirect to Points page once season has ended
export const checkSeasonEndHOC =
    <P extends Props>(WrappedComponent: React.ComponentType<P>) =>
    (props: P) => {
        if (props.isSeasonEnd) {
            return <Redirect to="/points" />;
        }
        return <WrappedComponent {...props} />;
    };
