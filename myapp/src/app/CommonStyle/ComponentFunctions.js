import {
  Platform,
  PermissionsAndroid,
  DeviceEventEmitter,
  PixelRatio,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Global } from '../Common/Global';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

export function CButtonShadow() {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;
  return isAndroidBelow9
    ? {
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }
    : {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };
}

export function CShadowDynamic(
  offsetX = 0,
  offsetY = 2,
  blurRadius = 6,
  spreadDistance = 0,
  color = 'rgba(0, 0, 0, 0.2)',
) {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;

  return isAndroidBelow9
    ? {
      elevation: 6,
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: 0.25,
      shadowRadius: blurRadius,
    }
    : {
      boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadDistance}px ${color}`,
    };
}

export function CSearchShadow() {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;
  return isAndroidBelow9
    ? {
      elevation: 10,
      shadowColor: Global.AppTheme.primary_color,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0,
      shadowRadius: 20,
    }
    : {
      boxShadow: `-3 3 5 -4 ${Global.AppTheme.primary_color}`,
    }; // offsetX  offsetY blurRadius spreadDistance color
}

export function CFooterShadow() {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;
  return isAndroidBelow9
    ? {
      elevation: 10,
      shadowColor: Global.AppTheme.primary_color,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0,
      shadowRadius: 20,
    }
    : {
      boxShadow: `0 4 10 0 ${Global.AppTheme.primary_color}`,
    }; // offsetX  offsetY blurRadius spreadDistance color
}

export function CProgressCircleShadow(color) {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;
  return isAndroidBelow9
    ? {
      elevation: 10,
      shadowColor: 'black',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0,
      shadowRadius: 20,
    }
    : {
      boxShadow: `-1 4 6 0 ${color}`,
    }; // offsetX  offsetY blurRadius spreadDistance color
}

export function CFooterShadowWhite(color) {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;
  return isAndroidBelow9
    ? {
      elevation: 10,
      shadowColor: 'black',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0,
      shadowRadius: 20,
    }
    : {
      boxShadow: `0 4 10 0 ${color}`,
    }; // offsetX  offsetY blurRadius spreadDistance color
}


export function normalize(size) {
  const newSize = scale < 1.5 ? size * scale : size * 1.6;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

/**
 * To check whether value is true && null && undefined
 */
export function isBNU(i) {
  return i && i != null && i != undefined ? true : false;
}

/**
 * To check whether value is null && undefined
 */
export function isNU(i) {
  return i != null && i != undefined ? true : false;
}

/**
 * To check whether value is  null && undefined && length > 0
 */
export function isNUL(i) {
  return i != null && i != undefined && i.length > 0 ? true : false;
}

/**
 * To check whether value is  null && undefined && !=""
 */
export function isNUQ(i) {
  return i != null && i != undefined && i != '' ? true : false;
}

/**
 * To check whether value is  null && undefined && !="" && != 0
 */
export function isNUQZ(i) {
  return i != null && i != undefined && i != '' && i != 0 ? true : false;
}

/**
 * To check whether value is true && null && undefined && length > 0
 */
export function isBNUL(i) {
  return i && i != null && i != undefined && i.length > 0 ? true : false;
}

export function isOrganism(i) {
  return i == 3 ? true : false;
}

export function isDescription(i) {
  return i == 1 || i == 6 || i == 7 || i == 8 ? true : false;
}

export function isValueBased(i) {
  return i == 2 || i == 4 || i == 5 ? true : false;
}

export function dlog(i) {
  if (__DEV__) {
    return console.log(i);
  } else {
  }
}

export function cdev() {
  if (__DEV__) {
    return true;
  } else {
    return false;
  }
}

export function clog(i) {
  return console.log(i);
}

export function ValueCheck(value) {
  if (value) {
    return true;
  } else {
    false;
  }
}


export function ArrayCheck(value) {
  if (value && value.length > 0) {
    return true;
  } else {
    false;
  }
}

export async function isPermitted() {
  if (Platform.OS !== 'android') return true;

  const androidVersion = parseInt(Platform.Version, 10);

  try {
    if (androidVersion < 30) {
      // Android 10 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else if (androidVersion >= 33) {
      // Android 13+
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      ]);

      return (
        granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_MEDIA_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (androidVersion >= 30 && androidVersion <= 32) {
      // Android 11–12: Try to request legacy read
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  } catch (err) {
    alert('File access permission error: ' + err);
    return false;
  }
}

export function getLoading(load) {
  setTimeout(load, 15000);
}
export function isDes(i) {
  return i == 1 ? true : false;
}

export function isVal(i) {
  return i == 2 ? true : false;
}

export function isOrg(i) {
  return i == 3 ? true : false;
}

export function isSero(i) {
  return i == 4 ? true : false;
}

export function isViro(i) {
  return i == 5 ? true : false;
}

export function isPath(i) {
  return i == 6 ? true : false;
}

export function isConnected() {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      console.log('Is Internet?', state.isInternetReachable);
      console.log('Details: - ', state.details);

      if (state.isConnected && state.isInternetReachable) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

export default function CBoxShadow() {
  const isAndroidBelow9 = Platform.OS === 'android' && Platform.Version < 28;

  return isAndroidBelow9
    ? {
      elevation: 10,
      shadowColor: Global.AppTheme.primary_color,
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0,
      shadowRadius: 20,
    }
    :
    {
      boxShadow: `-2 2 10 1  ${Global.AppTheme.primary_color}`, // offsetX  offsetY blurRadius spreadDistance color
    };
}


export function notifyMessage(msg, type) {
  DeviceEventEmitter.emit('event.testToast', {
    displaytext: msg,
    datavalue: type,
  });

  // let X = bottom != undefined && bottom != null ? bottom : 80
  // if (Platform.OS === 'android') {
  //     ToastAndroid.showWithGravityAndOffset(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM,
  //         0,
  //         X)
  // } else {
  //     Alert.alert(msg);
  // }
}

