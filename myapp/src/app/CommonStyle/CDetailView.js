import React from 'react';
import { StyleSheet, View, ImageBackground, Platform } from 'react-native';
import { APIURL } from '../Common/apiConstants';

const CDetailView = (props) => {


    const styles = StyleSheet.create({
        CDetailView: {
            flex: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%',
            backgroundColor: props.backgroundColor ? props.backgroundColor : 'white',
        },
        image: {
            flex: 1,
            width: Platform.OS === 'web' ? '88%' : '100%',
            alignSelf: 'center',
        }
    });

    return (
        <View style={styles.CDetailView}>
            <ImageBackground
                source={props.bgimage != undefined ? { uri: props.bgimage } : { uri: `${APIURL}insurancefile/getCommonFile/image/IMA.png` }}
                resizeMode={props.bgimage != undefined ? "stretch" : "contain"}
                imageStyle={props.bgimage != undefined ? { opacity: 1 } : { opacity: 0.1 }}
                style={styles.image}
            >
                {props.children}
            </ImageBackground>
        </View>
    );
};



export default CDetailView;