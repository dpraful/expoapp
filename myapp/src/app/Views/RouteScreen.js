import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icons from '../Common/Icons';
import { Global } from '../Common/Global';
import HShadowButton from '../HOC/HShadowButton';
import Loader from '../CommonStyle/Loader';

const routeModes = [
  { id: 'Drive', icon: 'car', duration: '24 min', distance: '9.6 km' },
  { id: 'Ride', icon: 'motorcycle', duration: '31 min', distance: '9.6 km' },
  { id: 'Walk', icon: 'walking', duration: '1 hr 52 min', distance: '8.1 km' },
];

const mapRoads = [
  { top: '14%', left: '-8%', width: '78%', rotate: '-12deg' },
  { top: '29%', left: '-5%', width: '86%', rotate: '8deg' },
  { top: '49%', left: '-4%', width: '82%', rotate: '-4deg' },
  { top: '67%', left: '4%', width: '82%', rotate: '15deg' },
  { top: '84%', left: '-4%', width: '76%', rotate: '-16deg' },
  { top: '-8%', left: '18%', width: '2%', height: '118%', rotate: '4deg' },
  { top: '-8%', left: '38%', width: '2%', height: '118%', rotate: '-9deg' },
  { top: '-8%', left: '57%', width: '2%', height: '118%', rotate: '12deg' },
  { top: '-8%', left: '76%', width: '2%', height: '118%', rotate: '-7deg' },
];

export default function RouteScreen({
  pickup = 'Starting point',
  destination = 'Destination',
  onBack,
}) {
  const navigationTimeout = useRef(null);
  const [selectedMode, setSelectedMode] = useState('Drive');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isStartingNavigation, setIsStartingNavigation] = useState(false);
  const mode = routeModes.find(item => item.id === selectedMode) || routeModes[0];

  useEffect(() => {
    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
      }
    };
  }, []);

  const toggleNavigation = () => {
    if (isNavigating) {
      setIsNavigating(false);
      return;
    }
    if (isStartingNavigation) {
      return;
    }

    setIsStartingNavigation(true);
    navigationTimeout.current = setTimeout(() => {
      navigationTimeout.current = null;
      setIsStartingNavigation(false);
      setIsNavigating(true);
    }, 500);
  };

  const arrivalTime = () => {
    const arrival = new Date();
    const minutes = selectedMode === 'Drive' ? 24 : selectedMode === 'Ride' ? 31 : 112;
    arrival.setMinutes(arrival.getMinutes() + minutes);
    return arrival.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Global.AppTheme.login_background_color}
      />
      <View style={styles.map}>
        <View style={styles.water} />
        <View style={styles.land} />
        <View style={styles.roadGrid}>
          {mapRoads.map((road, index) => (
            <View
              key={index}
              style={[
                styles.mapRoad,
                road.height ? styles.verticalRoad : null,
                {
                  top: road.top,
                  left: road.left,
                  width: road.width,
                  height: road.height || 5,
                  transform: [{ rotate: road.rotate }],
                },
              ]}
            />
          ))}
          <View style={styles.routeSegmentHorizontal} />
          <View style={styles.routeSegmentVertical} />
          <View style={styles.routeSegmentEnd} />
        </View>
        <View style={styles.mapTopControls}>
          <HShadowButton
            accessibilityRole="button"
            accessibilityLabel="Back to trip locations"
            buttonCallback={onBack}
            buttonstyle={[styles.buttonReset, styles.mapControl]}>
            <Icons.FontAwesome5
              name="arrow-left"
              color={Global.AppTheme.login_heading_color}
              size={19}
            />
          </HShadowButton>
          <HShadowButton
            accessibilityRole="button"
            accessibilityLabel="Map layers"
            buttonstyle={[styles.buttonReset, styles.mapControl]}>
              <Icons.FontAwesome5
                name="layer-group"
                color={Global.AppTheme.login_heading_color}
                size={19}
              />
          </HShadowButton>
        </View>
        <View style={styles.startMarker}>
          <Icons.FontAwesome5
            name="car"
            color={Global.AppTheme.login_surface_color}
            size={19}
          />
        </View>
        <View style={styles.destinationMarker}>
          <Icons.FontAwesome5
            name="map-marker-alt"
            color={Global.AppTheme.login_surface_color}
            size={17}
          />
        </View>
        <View style={styles.trafficBanner}>
          <Icons.FontAwesome5
            name="exclamation-triangle"
            color={Global.AppTheme.login_surface_color}
            size={16}
          />
          <Text style={styles.trafficText}>Heavy traffic near the marina</Text>
        </View>
        {isNavigating ? (
          <View style={styles.navigationBanner}>
            <Icons.FontAwesome5
              name="location-arrow"
              color={Global.AppTheme.login_surface_color}
              size={16}
            />
            <Text style={styles.navigationBannerText}>
              Navigation started · Live guidance unavailable
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <ScrollView
          style={styles.detailsScroll}
          contentContainerStyle={styles.detailsContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.eyebrow}>
                {isNavigating ? 'On your way' : 'Fastest route'}
              </Text>
              <Text style={styles.duration}>{mode.duration}</Text>
            </View>
            <Text style={styles.distance}>
              {mode.distance}  ·  arrive {arrivalTime()}
            </Text>
          </View>

          <View style={styles.modeRow}>
            {routeModes.map(item => {
              const selected = item.id === selectedMode;
              return (
                <HShadowButton
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  buttonCallback={() => setSelectedMode(item.id)}
                  buttonstyle={[
                    styles.buttonReset,
                    styles.modeButton,
                    selected && styles.modeButtonSelected,
                  ]}>
                  <Icons.FontAwesome5
                    name={item.icon}
                    color={
                      selected
                        ? Global.AppTheme.login_link_color
                        : Global.AppTheme.login_heading_color
                    }
                    size={16}
                  />
                  <Text
                    style={[
                      styles.modeText,
                      selected && styles.modeTextSelected,
                    ]}>
                    {item.id}
                  </Text>
                </HShadowButton>
              );
            })}
          </View>

          <View style={styles.tripSummary}>
            <View style={styles.tripStop}>
              <View style={styles.pickupDot} />
              <Text numberOfLines={2} style={styles.tripAddress}>
                {pickup}
              </Text>
            </View>
            <View style={styles.tripConnector} />
            <View style={styles.tripStop}>
              <View style={styles.dropoffMarker} />
              <Text numberOfLines={2} style={styles.tripAddress}>
                {destination}
              </Text>
            </View>
          </View>

          <Text style={styles.turnHeading}>Turn by turn</Text>
          <View style={styles.turnRow}>
            <View style={styles.turnIcon}>
              <Icons.FontAwesome5
                name="share"
                color={Global.AppTheme.login_heading_color}
                size={16}
              />
            </View>
            <View style={styles.turnDetails}>
              <Text style={styles.turnTitle}>Head north on Street 840</Text>
              <Text style={styles.turnSubtitle}>Keep right past the service road</Text>
            </View>
            <Text style={styles.turnDistance}>450 m</Text>
          </View>
          <View style={styles.turnRow}>
            <View style={styles.turnIcon}>
              <Icons.FontAwesome5
                name="share"
                color={Global.AppTheme.login_heading_color}
                size={16}
              />
            </View>
            <View style={styles.turnDetails}>
              <Text style={styles.turnTitle}>Turn right onto Al Istiqlal St</Text>
              <Text style={styles.turnSubtitle}>Moderate traffic near the roundabout</Text>
            </View>
            <Text style={styles.turnDistance}>1.8 km</Text>
          </View>
          <Text style={styles.routeDisclaimer}>
            Illustrative route estimate. Live maps and turn-by-turn directions are not connected.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <HShadowButton
            accessibilityRole="button"
            disabled={isStartingNavigation}
            accessibilityState={{ disabled: isStartingNavigation }}
            buttonCallback={toggleNavigation}
            buttonstyle={[styles.buttonReset, styles.startButton]}>
            <Icons.FontAwesome5
              name={isNavigating ? 'stop' : 'location-arrow'}
              color={Global.AppTheme.login_surface_color}
              size={17}
            />
            <Text style={styles.startButtonText}>
              {isNavigating ? 'End navigation' : 'Start navigation'}
            </Text>
          </HShadowButton>
        </View>
      </View>
      {isStartingNavigation && (
        <Loader visible={isStartingNavigation} message="Starting navigation..." />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonReset: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  screen: {
    flex: 1,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  map: {
    flex: 0.85,
    minHeight: 200,
    overflow: 'hidden',
    backgroundColor: '#b8d8e5',
  },
  water: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '42%',
    height: '100%',
    backgroundColor: '#a8ccdc',
  },
  land: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '72%',
    height: '100%',
    backgroundColor: '#ded9c8',
    borderTopRightRadius: 110,
    borderBottomRightRadius: 80,
  },
  roadGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  mapRoad: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 3,
    opacity: 0.9,
  },
  verticalRoad: {
    width: 5,
  },
  routeSegmentHorizontal: {
    position: 'absolute',
    top: '59%',
    left: 0,
    width: '48%',
    borderTopWidth: 2,
    borderColor: Global.AppTheme.login_link_color,
    borderStyle: 'dashed',
  },
  routeSegmentVertical: {
    position: 'absolute',
    top: '42%',
    left: '47%',
    height: '19%',
    borderLeftWidth: 2,
    borderColor: Global.AppTheme.login_link_color,
    borderStyle: 'dashed',
  },
  routeSegmentEnd: {
    position: 'absolute',
    top: '35%',
    left: '46%',
    width: '26%',
    borderTopWidth: 2,
    borderColor: Global.AppTheme.login_link_color,
    borderStyle: 'dashed',
    transform: [{ rotate: '-12deg' }],
  },
  mapTopControls: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapControl: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: Global.AppTheme.login_surface_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startMarker: {
    position: 'absolute',
    top: '54%',
    left: '7%',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: Global.AppTheme.login_surface_color,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    position: 'absolute',
    top: '25%',
    left: '73%',
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: Global.AppTheme.login_surface_color,
    backgroundColor: Global.AppTheme.login_heading_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficBanner: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: Global.AppTheme.login_heading_color,
  },
  trafficText: {
    color: Global.AppTheme.login_surface_color,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 9,
  },
  navigationBanner: {
    position: 'absolute',
    top: 70,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Global.AppTheme.login_primary_color,
  },
  navigationBannerText: {
    flex: 1,
    color: Global.AppTheme.login_surface_color,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  sheet: {
    flex: 1.35,
    minHeight: 340,
    backgroundColor: Global.AppTheme.login_surface_color,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: -12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 54,
    height: 5,
    borderRadius: 3,
    backgroundColor: Global.AppTheme.login_border_color,
    marginTop: 10,
    marginBottom: 8,
  },
  detailsScroll: {
    flex: 1,
  },
  detailsContent: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 15,
  },
  eyebrow: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 13,
    fontWeight: '600',
  },
  duration: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    marginTop: 2,
  },
  distance: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 12,
    marginBottom: 7,
  },
  modeRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  modeButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    marginRight: 8,
  },
  modeButtonSelected: {
    backgroundColor: '#fff0e9',
    borderColor: Global.AppTheme.login_link_color,
  },
  modeText: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 7,
  },
  modeTextSelected: {
    color: Global.AppTheme.login_link_color,
  },
  tripSummary: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 17,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  tripStop: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Global.AppTheme.login_primary_color,
  },
  dropoffMarker: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: Global.AppTheme.login_heading_color,
  },
  tripConnector: {
    height: 14,
    marginLeft: 5,
    borderLeftWidth: 2,
    borderColor: Global.AppTheme.login_border_color,
  },
  tripAddress: {
    flex: 1,
    color: Global.AppTheme.login_heading_color,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  turnHeading: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 2,
  },
  turnRow: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Global.AppTheme.login_border_color,
  },
  turnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Global.AppTheme.login_background_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  turnDetails: {
    flex: 1,
  },
  turnTitle: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 13,
    fontWeight: '600',
  },
  turnSubtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 12,
    marginTop: 4,
  },
  turnDistance: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 12,
    marginLeft: 6,
  },
  routeDisclaimer: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Global.AppTheme.login_border_color,
  },
  startButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: Global.AppTheme.login_primary_color,
  },
  startButtonText: {
    color: Global.AppTheme.login_surface_color,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
