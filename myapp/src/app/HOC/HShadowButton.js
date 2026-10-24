import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';

import {
    isBNU,
    isNU,
    isNUQ,
    normalize,
} from '../CommonStyle/ComponentFunctions';

import HOCIcons from './HOCIcons';
import { Global } from '../Common/Global';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive size calculations
const MIN_WIDTH = SCREEN_WIDTH * 0.1;   // 25% of screen width
const MAX_WIDTH = SCREEN_WIDTH * 0.9;    // 90% of screen width

const MIN_HEIGHT = SCREEN_HEIGHT * 0.1; // 5% of screen height
const MAX_HEIGHT = SCREEN_HEIGHT * 0.1; // 12% of screen height

export default function HShadowButton(props) {
    const {
        disabled,
        buttonCallback,
        longCallBack,
        buttonstyle,
        useicon,
        iconname,
        icongroup,
        iconcolor,
        iconsize,
        iconstyle,
        usetext,
        numberOfLines,
        disabletextadjust = true,
        textstyle,
        displaytext,
        children,
        accessibilityRole,
        accessibilityLabel,
        accessibilityState,
        activeOpacity = 0.7,
        hitSlop,
    } = props;

    return (
        <TouchableOpacity
            disabled={!!disabled}
            onPress={() => {
                if (isNU(buttonCallback)) buttonCallback(true);
            }}
            onLongPress={() => {
                if (isNU(longCallBack)) longCallBack(true);
            }}
            activeOpacity={activeOpacity}
            accessibilityRole={accessibilityRole}
            accessibilityLabel={accessibilityLabel}
            accessibilityState={accessibilityState}
            hitSlop={hitSlop}
            style={[
                styles.buttonBase,
                isNU(buttonstyle) ? buttonstyle : {},
            ]}
        >
            {children}
            {useicon && (
                <HOCIcons.Icons
                    icongroup={isNU(icongroup) ? icongroup : 5}
                    name={isBNU(iconname) ? iconname : 'file-alt'}
                    color={isNU(iconcolor) ? iconcolor : Global.AppTheme.primary_color}
                    size={isNU(iconsize) ? iconsize : normalize(15)}
                    style={iconstyle ?? {}}
                />
            )}

            {usetext && (
                <Text
                    numberOfLines={isNU(numberOfLines) ? numberOfLines : 2}
                    adjustsFontSizeToFit={!disabletextadjust}
                    ellipsizeMode="tail"
                    style={textstyle ?? styles.defaultText}
                >
                    {isNUQ(displaytext) ? displaytext : null}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonBase: {
        minWidth: Platform.OS === "web" && MIN_WIDTH,
        maxWidth: Platform.OS === "web" && MAX_WIDTH,
        minHeight: Platform.OS === "web" && MIN_HEIGHT,
        maxHeight: Platform.OS === "web" && MAX_HEIGHT,

        paddingHorizontal: normalize(10),
        paddingVertical: normalize(6),

        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: normalize(8),

        backgroundColor: Global.AppTheme.white,

        // Shadow (Android + iOS)
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },

    defaultText: {
        color: Global.AppTheme.primary_color,
        fontSize: normalize(6),
        textAlign: 'center',
        marginTop: normalize(2),
    },
});
