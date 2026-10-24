import React from 'react';
import { StyleSheet, View} from 'react-native';
import { Global } from '../Common/Global';

const CContainerView = props => {

    const styles = StyleSheet.create({
        CContainerView : {
            flex: 1,
            backgroundColor: Global.AppTheme.primary_color,
        },
    });

    return (
        <View style={styles.CContainerView}>
            {props.children}
        </View>
    );
};

export default CContainerView;