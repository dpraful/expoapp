import React from 'react';
import LoginLayout from '../Layout/LoginLayout';
import HomeScreen from '../Views/HomeScreen';
import RouteScreen from '../Views/RouteScreen';

function HView(props) {
    const components = {
        LoginLayout: LoginLayout,
        HomeScreen: HomeScreen,
        RouteScreen: RouteScreen,
    };

    const ViewHOCComponent = typeof components[props.component] !== "undefined" ? components[props.component] : null;

    return (
        ViewHOCComponent != null ?
            <ViewHOCComponent
                {...props}
            /> : null
    );
}
export default HView;