import React from 'react';
import {
  Dimensions,
  Platform,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CFooterView = ({ style, children }) => {
  const screenHeight = Dimensions.get('screen').height;
  const isWeb = Platform.OS === 'web';

  const containerStyle = isWeb
    ? {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 80,
      borderLeftWidth: 1,
      borderLeftColor: 'lightgrey',
      zIndex: 10,
      elevation: 10,
      maxHeight: '90%',
    }
    : {
      borderTopWidth: 1,
      borderTopColor: 'lightgrey',
    };

  return (
    <View style={[styles.base, containerStyle, style]}>
      <ScrollView
        horizontal={!isWeb}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          isWeb ? styles.webContent : styles.mobileContent,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
  },
  webContent: {
    flexDirection: 'column',
    paddingVertical: '1%',
  },
  mobileContent: {
    flexDirection: 'row',
    paddingHorizontal: '1%',
  },
});

export default CFooterView;