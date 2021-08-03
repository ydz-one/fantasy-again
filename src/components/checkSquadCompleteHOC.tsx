import React from 'react';
import { Redirect } from 'react-router-dom';

interface Props {
    isSquadComplete: boolean;
}

// Redirect to Squad Selection page if squad is not complete
export const checkSquadCompleteHOC =
    <P extends Props>(WrappedComponent: React.ComponentType<P>) =>
    (props: P) => {
        if (!props.isSquadComplete) {
            return <Redirect to="/squadselection" />;
        }
        return <WrappedComponent {...props} />;
    };
