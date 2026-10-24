import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Linking,
    StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import { normalize } from '../CommonStyle/ComponentFunctions';
import { notifyMessage, ValueCheck } from '../CommonStyle/ComponentFunctions';
import CContainerView from '../CommonStyle/CContainerView'
import CDetailView from '../CommonStyle/CDetailView';
import NotificationContext from '../Handlers/NoticationsContext';
import { Global } from '../Common/Global';
import HHeading from '../HOC/HHeading';
import Icons from '../Common/Icons';
import HeaderBlock from '../CommonStyle/HeaderBlock';

const Notifications = () => {

    var TestArray = [{ "code": 12, "displayheader": "UPDATE", "displaytext": "Updates are available ", "status": true, "patientnumber": 0, "patientname": "", "tokennumber": 0, "phonenumber": "", "qrcode": 0, "date": "2022-12-07T15:59:00", "time": "2022-12-07T15:59:00" }, { "code": 11, "displayheader": "Consultation", "displaytext": "Booking is confirmed on 31st Dec 2022 for CHRISTY MARIA; Token Number :6 Patient name :HAROLD  LOUIS TEST", "status": false, "patientnumber": 0, "patientname": "HAROLD  LOUIS TEST", "tokennumber": 6, "phonenumber": "7338483582", "qrcode": 2345, "date": "2022-12-07T15:15:00", "time": "2022-12-07T15:15:00" }, { "code": 8, "displayheader": "Consultation", "displaytext": "Booking is confirmed on 30th Dec 2022 for SR.ROSE MAVELIKUNNEL MBBS,DGO; Token Number :19 Patient name :ALVIN ANTONY", "status": false, "patientnumber": 0, "patientname": "ALVIN ANTONY", "tokennumber": 19, "phonenumber": "7338483582", "qrcode": 2345, "date": "2022-12-06T14:53:00", "time": "2022-12-06T14:53:00" }, { "code": 7, "displayheader": "Consultation", "displaytext": "Booking is confirmed on 28th Dec 2022 for CHRISTY MARIA; Token Number :4 Patient name :HAROLD LOUIS", "status": false, "patientnumber": 0, "patientname": "HAROLD LOUIS", "tokennumber": 4, "phonenumber": "7338483582", "qrcode": 2345, "date": "2022-12-05T16:23:00", "time": "2022-12-05T16:23:00" }, { "code": 1, "displayheader": "HEADER", "displaytext": "NOTIFICATIONS", "status": false, "patientnumber": 0, "patientname": "", "tokennumber": 0, "phonenumber": "", "qrcode": 0, "date": "2022-12-05T12:28:00", "time": "2022-12-05T12:28:00" }]

    const NoticationData = React.useContext(
        NotificationContext,
    );
    // console.log("RRRRRRRRRREEEEEEEEESSSSSVARRRRRRRRRR",JSON.stringify(NoticationData))
    var today = new Date()
    const [NotificationArr, setNotificationArr] = useState(NoticationData)
    const [refresh, setRefresh] = useState(0)
    const [pulltorefresh] = useState(false)

    return (
        <CContainerView>
            <HeaderBlock />
            <CDetailView userlist={false}>
                <View style={{ marginTop: normalize(-3), flex: 1 }}>
                    <HHeading
                        styles={{
                            "iconname": 'bell',
                            "bgcolor": Global.AppTheme.login_background_color,
                            "iconsize": 16,
                            "iconcolor": Global.AppTheme.login_primary_color,
                            "displaytext": "Notifications",
                            "textsize": 14,
                            "textcolor": Global.AppTheme.login_heading_color
                        }}
                        callBack={val => (val == undefined ? null : console.log(val))}>
                    </HHeading>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={NotificationArr}
                            renderItem={renderItem}
                            style={styles.list}
                            initialNumToRender={10}
                            maxToRenderPerBatch={20}
                            refreshControl={
                            <RefreshControl
                                refreshing={pulltorefresh}
                                size={"large"}
                                tintColor={Global.AppTheme.login_primary_color}
                                colors={[Global.AppTheme.login_primary_color]}
                                progressBackgroundColor={Global.AppTheme.login_surface_color}
                                onRefresh={() => console.log("......Refresh.....")} 
                            />
                            }
                            contentContainerStyle={styles.listContent}
                            keyExtractor={(item, index) => 'key' + index}
                        />
                    </View>
                </View>
            </CDetailView>
        </CContainerView>
    )

    function urlify(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var x
        text.replace(urlRegex, function (url) {
            x = url
        })
        return x
    }

    function getLink(params) {
        var linkUrl = urlify(params.displaytext)
        if (linkUrl != undefined && linkUrl != null) {
            Linking.openURL(linkUrl).catch(err => notifyMessage("Couldn't load page", 4))
        }
    }

    function getNotification(data) {
        switch (data.type) {
            case 4: console.log("LAB RESULTS PRESSED")
                break;

            default: getLink(data)
                break;
        }

        data.status = false
        setRefresh(refresh + 1)
    }

    function getIcons(data) {
        switch (data.type) {
            case 4: return "microscope"
            default:return "bell"
        }
    }

    function getTimeCalculate(datePassed) {
        var newDate = moment(today).format('DD/MM/YYYY');
        var fromdate = moment(datePassed).format('DD/MM/YYYY');

        var a = moment(newDate, 'DD/MM/YYYY');
        var b = moment(fromdate, 'DD/MM/YYYY');
        var diffDays = b.diff(a, 'days');
        return -diffDays == 0 ? "Today" : -diffDays + " Days ago"
    }

    function renderItem({ item }) {
        return (
            <TouchableOpacity onPress={() => getNotification(item)}
                style={[styles.notificationCard, !item.status && styles.readNotification]}>
                <View style={styles.notificationIconContainer}>
                    <View style={styles.notificationIconCircle}>
                        <Icons.FontAwesome5
                            name={getIcons(item)}
                            color={Global.AppTheme.login_primary_color}
                            size={normalize(18)}
                        />
                    </View>
                </View>
                <View style={styles.notificationDetails}>
                    <View style={styles.notificationTitleRow}>
                        <Text numberOfLines={1} style={styles.notificationTitle}>
                            {item.displayheader}
                        </Text>
                        {item.status ? <View style={styles.unreadDot} /> : null}
                    </View>
                    <Text style={styles.notificationMessage}>{item.displaytext}</Text>
                    <View style={styles.notificationMeta}>
                        <Text style={styles.notificationTime}>
                            {getTimeCalculate(item.time)}
                        </Text>
                        <Ionicons
                            name={item.status ? 'eye-outline' : 'eye-off-outline'}
                            color={Global.AppTheme.login_subtitle_color}
                            size={normalize(14)}
                        />
                    </View>
                </View>

                {ValueCheck(item.user) ? (
                    <View style={styles.userTag}>
                        <Text style={styles.userTagText}>USERNAME</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: Global.AppTheme.login_background_color,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 20,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Global.AppTheme.login_border_color,
        backgroundColor: Global.AppTheme.login_surface_color,
    },
    readNotification: {
        backgroundColor: Global.AppTheme.login_background_color,
    },
    notificationIconContainer: {
        width: 48,
        marginRight: 12,
        alignItems: 'center',
    },
    notificationIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Global.AppTheme.login_background_color,
    },
    notificationDetails: {
        flex: 1,
    },
    notificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationTitle: {
        flex: 1,
        color: Global.AppTheme.login_heading_color,
        fontSize: normalize(13),
        fontWeight: '700',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
        backgroundColor: Global.AppTheme.login_primary_color,
    },
    notificationMessage: {
        color: Global.AppTheme.login_text_color,
        fontSize: normalize(12),
        lineHeight: normalize(17),
        marginTop: 5,
    },
    notificationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    notificationTime: {
        color: Global.AppTheme.login_subtitle_color,
        fontSize: normalize(10),
        marginRight: 8,
    },
    userTag: {
        position: 'absolute',
        bottom: normalize(5),
        right: normalize(8),
    },
    userTagText: {
        color: Global.AppTheme.login_subtitle_color,
        fontSize: normalize(9),
    },
});

export default Notifications;