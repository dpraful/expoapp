import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { normalize } from '../CommonStyle/ComponentFunctions';
import HOCIcons from './HOCIcons';

function HHeading(props) {
    const styles = props.styles ?? {
        iconname: 'file',
        bgcolor: '#f2efef',
        iconsize: 18,
        iconcolor: 'black',
        displaytext: 'Testing',
        textsize: 15,
        textcolor: 'darkblue',
    };

    return (
        <TouchableOpacity
            onPress={() => props.callBack?.(true)}
            style={{
                backgroundColor: styles.bgcolor,
                paddingVertical: 3,
                paddingHorizontal: 6,
                marginTop: 3,
                marginBottom: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
                borderWidth: 0.5,
                borderColor: 'lightgrey',
                width: '99%',
                alignSelf: 'center',
            }}
        >
            <TouchableOpacity
                onPress={() => props.Expand?.(1)}
                disabled={!props.Expand}
                style={{
                    width: normalize(30),
                    alignItems: 'center',
                    marginRight: 5,
                }}
            >
                <HOCIcons.Icons
                    icongroup={styles.icongroup ?? 5}
                    name={styles.iconname}
                    color={styles.iconcolor}
                    size={normalize(styles.iconsize)}
                />
            </TouchableOpacity>

            <Text
                style={{
                    textShadowRadius: 2,
                    fontSize: normalize(styles.textsize),
                    fontWeight: 'bold',
                    color: styles.textcolor,
                    flex: 1,
                }}
            >
                {styles.displaytext}
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    width: normalize(60),
                    justifyContent: 'space-around',
                }}
            >
                {props.children}
            </View>
        </TouchableOpacity>
    );
}

export default memo(HHeading);
