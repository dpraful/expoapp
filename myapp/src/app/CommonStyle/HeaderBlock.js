import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { Global } from '../Common/Global';
import { normalize } from '../CommonStyle/ComponentFunctions';
import NotificationContext from '../Handlers/NoticationsContext';
import moment from 'moment';
import { ValueCheck, isNUQZ } from '../CommonStyle/ComponentFunctions';
import ABlink from '../Alerts/ABlink';
import CBackHandler from '../CommonStyle/CBackHandler';
import ResponseComponentContext from '../Handlers/ResponseComponentContext';
import CNetworkStatus from '../CommonStyle/CNetworkStatus';
import { useRouter } from 'expo-router';
import HShadowButton from '../HOC/HShadowButton';

const HeaderBlock = (props) => {
  const { responseJSON, setResponseJSON } = useContext(ResponseComponentContext);
  const [isShowSlidermenu, setIsShowSlidermenu] = useState(false);
  const [backHandler, setBackHandler] = useState(false);
  const [backHandlerLogOut, setBackHandlerLogOut] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const [jsonoverlay, setJsonOverlay] = useState(false);
  const router = useRouter()


  const NoticationData = React.useContext(NotificationContext);

  const result = NoticationData.filter(obj => obj.status === true);

  const styles = StyleSheet.create({
    buttonReset: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      elevation: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      backgroundColor: 'transparent',
    },
    container: {
      backgroundColor: Global.AppTheme.login_surface_color,
      justifyContent: 'center',
      paddingHorizontal: normalize(12),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Global.AppTheme.login_border_color,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: normalize(52),
      paddingVertical: normalize(6),
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: normalize(38),
      height: normalize(38),
      borderRadius: normalize(12),
      backgroundColor: Global.AppTheme.login_background_color,
    },
    logoContainer: {
      width: 0,
      height: 0,
    },
    betaContainer: {
      position: 'absolute',
      bottom: normalize(-16),
      right: normalize(-88),
    },
    betaText: {
      color: Global.AppTheme.login_primary_color,
      fontSize: normalize(11),
      letterSpacing: 1,
      fontWeight: '700',
    },
    versionText: {
      color: Global.AppTheme.login_subtitle_color,
      fontSize: normalize(8),
    },
    userInfoButton: {
      flexDirection: 'row',
      borderWidth: 0,
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: normalize(10),
    },
    userInfoContainer: {
      borderWidth: 0,
    },
    userNameText: {
      fontWeight: 'bold',
      fontSize: normalize(13),
      marginLeft: 5,
      color: Global.AppTheme.login_heading_color,
    },
    departmentText: {
      fontFamily: Global.fontNormal,
      fontSize: normalize(11),
      marginLeft: 5,
      color: Global.AppTheme.login_subtitle_color,
    },
    rightIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderWidth: 0,
    },
    notificationButton: {
      marginLeft: normalize(10),
      width: normalize(38),
      height: normalize(38),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: normalize(12),
      backgroundColor: Global.AppTheme.login_background_color,
    },
    notificationBadge: {
      position: 'absolute',
      right: normalize(-5),
      top: normalize(-8),
      backgroundColor: Global.AppTheme.login_surface_color,
      alignItems: 'center',
      borderRadius: 20,
      width: normalize(15),
      minHeight: normalize(15),
      justifyContent: 'center',
    },
    notificationCount: {
      fontSize: normalize(8),
      fontWeight: '700',
      color: Global.AppTheme.login_heading_color,
    },
    menuButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: normalize(38),
      height: normalize(38),
      borderRadius: normalize(12),
      backgroundColor: Global.AppTheme.login_background_color,
    },
    loginTimeText: {
      fontSize: normalize(9),
      marginLeft: 0,
      color: Global.AppTheme.login_subtitle_color,
    },
    jsonModalContainer: {
      backgroundColor: Global.AppTheme.login_surface_color,
      borderWidth: 1,
      height: Dimensions.get('screen').height * 0.9,
      alignSelf: 'center',
      width: Dimensions.get('screen').width * 0.9,
      borderColor: Global.AppTheme.login_border_color,
      borderRadius: normalize(16),
      padding: normalize(14),
    },
    closeButton: {
      textAlign: 'right',
      fontWeight: 'bold',
      color: Global.AppTheme.login_heading_color,
    },
    jsonText: {
      fontSize: normalize(10),
      color: Global.AppTheme.login_heading_color,
      fontFamily: 'Courier New',
    },
  });

  const OnPressGoBack = () => {
    if (props.callback) {
      props.callback(true);
    } else {
      if (ValueCheck(props.backhandler)) {
        if (ValueCheck(props.consultation) && Global.EditStatus == 1) {
          setBackHandler(true);
        } else {
          router.back();
        }
      } else {
        router.back();
      }
    }
  };

  const renderJsonModal = () => (
    <Modal
      onRequestClose={() => setJsonOverlay(false)}
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transparent={true}
    >
      <View style={styles.jsonModalContainer}>
        <HShadowButton
          accessibilityRole="button"
          buttonCallback={() => setJsonOverlay(false)}
          buttonstyle={styles.buttonReset}
        >
          <Text style={styles.closeButton}>Close</Text>
        </HShadowButton>
        <ScrollView>
          <Text selectable={true} style={styles.jsonText}>
            {JSON.stringify(responseJSON, null, 2)}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderBetaVersion = () => (
    <View style={styles.betaContainer}>
      <ABlink duration={500}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.betaText}>BETA TESTING</Text>
          <Text style={styles.versionText}>
            {Global.version ? `V ${Global.version}` : null}
          </Text>
        </View>
      </ABlink>
    </View>
  );

  const renderUserInfo = () => (
    <HShadowButton
      accessibilityRole="button"
      buttonCallback={() => props.webview != undefined ? null : setOverlay(true)}
      buttonstyle={[styles.buttonReset, styles.userInfoButton]}
    >
      <View style={styles.userInfoContainer}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={2}
          style={styles.userNameText}
        >
          {props.webview != undefined ? "" : Global.userData && Global.userData.department != undefined && Global.userData.department != "" ? Global.userData.username : ''}
        </Text>
        {Global.userData && Global.userData.department != undefined && Global.userData.department != "" && props.webview == undefined ? (
          <Text
            adjustsFontSizeToFit
            style={styles.departmentText}
          >
            {Global.userData.department}
          </Text>
        ) : null}
      </View>
    </HShadowButton>
  );

  const renderRightIcons = () => (
    <View style={styles.rightIconsContainer}>
      <CNetworkStatus />
      <HShadowButton
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        buttonCallback={() => router.navigate('/notifications')}
        buttonstyle={[styles.buttonReset, styles.notificationButton]}
      >
        <View
          style={[
            styles.notificationBadge,
            {
              backgroundColor: result.length > 0
                ? Global.AppTheme.login_primary_color
                : Global.AppTheme.login_background_color,
            },
          ]}>
          <ABlink>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.notificationCount,
                {                 color: result.length > 0
                  ? Global.AppTheme.login_surface_color
                  : Global.AppTheme.login_heading_color, }
              ]}
            >
              {result.length}
            </Text>
          </ABlink>
        </View>
        <Ionicons
          name="notifications-outline"
          color={Global.AppTheme.login_heading_color}
          size={normalize(18)}
        />
      </HShadowButton>
    </View>
  );

  return (
    <View style={[styles.container, props.style]} key={refresh}>
      <StatusBar
        backgroundColor={Global.AppTheme.login_surface_color}
        barStyle="dark-content"
      />

      {jsonoverlay && renderJsonModal()}

      <View style={styles.headerContent}>
        <HShadowButton
          accessibilityRole="button"
          accessibilityLabel="Go back"
          buttonstyle={[styles.buttonReset, styles.backButton]}
          buttonCallback={OnPressGoBack}
        >
          <Ionicons
            name={'chevron-back'}
            color={Global.AppTheme.login_heading_color}
            size={normalize(25)}
          />
          <View style={styles.logoContainer}>
           
          </View>
          {Global.betaversion && renderBetaVersion()}
        </HShadowButton>

        {renderUserInfo()}

        {props.webview != undefined ? null : renderRightIcons()}
      </View>
    
      {backHandler && (
        <CBackHandler
          type={5}
          callBack={(val) => (val == undefined ? null : (setBackHandler(val), router.back()))}
          close={(val) => (val == undefined ? null : setBackHandler(val))}
        />
      )}

      {backHandlerLogOut && (
        <CBackHandler
          type={6}
          callBack={(val) => (val == undefined ? null : (setBackHandlerLogOut(val), router.back()))}
          close={(val) => (val == undefined ? null : setBackHandlerLogOut(val))}
        />
      )}
    </View>
  );
};

export default HeaderBlock;