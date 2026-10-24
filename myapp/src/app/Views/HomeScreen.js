import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import Icons from '../Common/Icons';
import { Global } from '../Common/Global';
import HShadowButton from '../HOC/HShadowButton';

const suggestedLocations = [
  {
    id: 'home',
    name: 'Home',
    address: 'Villa 12, Street 840, Zone 61 · West Bay',
    icon: 'home',
    recent: false,
  },
  {
    id: 'marina',
    name: 'Marina Office Tower',
    address: 'Level 14, Al Fardan Rd · Lusail Marina',
    icon: 'home',
    recent: false,
  },
  {
    id: 'corniche',
    name: 'Corniche Ferry Terminal',
    address: 'Gate 3, Corniche Promenade',
    icon: 'clock-o',
    recent: true,
  },
  {
    id: 'msheireb',
    name: 'Msheireb Metro Station',
    address: 'Al Kinana St · Msheireb Downtown',
    icon: 'clock-o',
    recent: true,
  },
  {
    id: 'airport',
    name: 'Hamad International Airport',
    address: 'Hamad International Airport · Doha',
    icon: 'clock-o',
    recent: true,
  },
];

const mapMarkers = [
  { location: suggestedLocations[0], top: '20%', left: '18%' },
  { location: suggestedLocations[1], top: '45%', left: '48%' },
  { location: suggestedLocations[2], top: '23%', left: '72%' },
  { location: suggestedLocations[3], top: '68%', left: '30%' },
  { location: suggestedLocations[4], top: '65%', left: '78%' },
];

export default function HomeScreen(props) {
  const [pickup, setPickup] = useState(props.pickup || '');
  const [destination, setDestination] = useState(props.destination || '');
  const [activeField, setActiveField] = useState('pickup');
  const [tripReady, setTripReady] = useState(false);
  const [mapPickerVisible, setMapPickerVisible] = useState(false);
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const [message, setMessage] = useState('');

  const activeValue = activeField === 'pickup' ? pickup : destination;
  const filteredLocations = suggestedLocations.filter(location => {
    const search = activeValue.trim().toLowerCase();
    return (
      !search ||
      location.name.toLowerCase().includes(search) ||
      location.address.toLowerCase().includes(search)
    );
  });

  const selectLocation = location => {
    if (activeField === 'pickup') {
      setPickup(location);
    } else {
      setDestination(location);
    }
    setMessage('');
    setMapPickerVisible(false);
  };

  const useCurrentLocation = async () => {
    setActiveField('pickup');
    setMessage('');
    setIsFindingLocation(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setMessage('Location permission was not granted. Enter a pickup manually.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;
      setPickup(`Current location (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
    } catch (error) {
      setMessage('Unable to get your location. Enter a pickup manually and try again.');
      console.warn('Unable to get current location', error);
    } finally {
      setIsFindingLocation(false);
    }
  };

  const swapLocations = () => {
    setPickup(destination);
    setDestination(pickup);
    setActiveField('pickup');
    setMessage('');
  };

  const proceed = () => {
    if (!pickup.trim() || !destination.trim()) {
      setMessage('Choose both a pickup and a drop-off location.');
      return;
    }
    setTripReady(true);
  };

  const proceedToRoute = () => {
    props.onProceedToRoute?.({
      pickup: pickup.trim(),
      destination: destination.trim(),
    });
  };

  const renderSuggestions = inMapPicker => (
    <View style={styles.locationList}>
      {filteredLocations.map((location, index) => (
        <HShadowButton
          key={location.id}
          accessibilityRole="button"
          buttonCallback={() => selectLocation(location.name)}
          buttonstyle={[
            styles.buttonReset,
            styles.locationRow,
            index === filteredLocations.length - 1 && styles.lastLocationRow,
          ]}>
          <View style={styles.locationIcon}>
            <Icons.FontAwesome
              name={location.icon}
              color={Global.AppTheme.login_heading_color}
              size={19}
            />
          </View>
          <View style={styles.locationDetails}>
            <Text numberOfLines={1} style={styles.locationName}>
              {location.name}
            </Text>
            <Text numberOfLines={1} style={styles.locationAddress}>
              {location.address}
            </Text>
          </View>
          {inMapPicker ? (
            <Icons.FontAwesome5
              name="map-marker-alt"
              color={Global.AppTheme.login_primary_color}
              size={17}
            />
          ) : null}
        </HShadowButton>
      ))}
      {filteredLocations.length === 0 ? (
        <Text style={styles.emptyText}>
          No saved places match. Enter a location above to use it.
        </Text>
      ) : null}
    </View>
  );

  if (tripReady) {
    return (
      <View style={styles.screen}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Global.AppTheme.login_surface_color}
        />
        <View style={styles.header}>
          <HShadowButton
            accessibilityRole="button"
            buttonCallback={() => setTripReady(false)}
            buttonstyle={[styles.buttonReset, styles.backButton]}>
            <Icons.FontAwesome5
              name="arrow-left"
              color={Global.AppTheme.login_heading_color}
              size={20}
            />
          </HShadowButton>
          <Text style={styles.title}>Your trip is ready</Text>
          <Text style={styles.subtitle}>Step 2 of 2 · Review your locations</Text>
        </View>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.readyContent}>
          <View style={styles.readyIcon}>
            <Icons.FontAwesome5
              name="route"
              color={Global.AppTheme.login_surface_color}
              size={24}
            />
          </View>
          <Text style={styles.readyHeading}>Trip overview</Text>
          <Text style={styles.readySubtitle}>
            Check your starting point and destination before continuing.
          </Text>
          <View style={styles.tripCard}>
            <View style={styles.tripStop}>
              <View style={styles.pickupDot} />
              <View style={styles.tripStopDetails}>
                <Text style={styles.tripStopLabel}>Starting point</Text>
                <Text style={styles.tripStopValue}>{pickup}</Text>
              </View>
            </View>
            <View style={styles.tripDivider} />
            <View style={styles.tripStop}>
              <View style={styles.dropoffMarker} />
              <View style={styles.tripStopDetails}>
                <Text style={styles.tripStopLabel}>Destination</Text>
                <Text style={styles.tripStopValue}>{destination}</Text>
              </View>
            </View>
          </View>
          <HShadowButton
            accessibilityRole="button"
            buttonCallback={() => setTripReady(false)}
            buttonstyle={[styles.buttonReset, styles.editTripButton]}>
            <Text style={styles.editTripText}>Edit locations</Text>
          </HShadowButton>
        </ScrollView>
        <View style={styles.footer}>
          <HShadowButton
            accessibilityRole="button"
            buttonCallback={proceedToRoute}
            buttonstyle={[styles.buttonReset, styles.nextButton]}>
            <Text style={styles.nextText}>Proceed to route</Text>
          </HShadowButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Global.AppTheme.login_surface_color}
      />
      <View style={styles.header}>
        <HShadowButton
          accessibilityRole="button"
          accessibilityLabel="Back to login"
          buttonCallback={props.onBack}
          buttonstyle={[styles.buttonReset, styles.backButton]}>
          <Icons.FontAwesome5
            name="arrow-left"
            color={Global.AppTheme.login_heading_color}
            size={20}
          />
        </HShadowButton>
        <Text style={styles.title}>Where are you going?</Text>
        <Text style={styles.subtitle}>Step 1 of 2 · Set pickup and drop-off</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.routeCard}>
          <View style={styles.routeMarkerColumn}>
            <View style={styles.pickupDot} />
            <View style={styles.routeLine} />
            <View style={styles.dropoffMarker} />
          </View>
          <View style={styles.routeFields}>
            <HShadowButton
              activeOpacity={1}
              buttonCallback={() => setActiveField('pickup')}
              buttonstyle={[styles.buttonReset, styles.routeFieldButton]}>
              <Text style={styles.pickupLabel}>Pickup</Text>
              <TextInput
                value={pickup}
                onChangeText={value => {
                  setPickup(value);
                  setActiveField('pickup');
                  setMessage('');
                }}
                onFocus={() => setActiveField('pickup')}
                placeholder="Choose a starting point"
                placeholderTextColor={Global.AppTheme.login_placeholder_color}
                style={styles.routeInput}
                returnKeyType="next"
              />
            </HShadowButton>
            <View style={styles.divider} />
            <HShadowButton
              activeOpacity={1}
              buttonCallback={() => setActiveField('destination')}
              buttonstyle={[styles.buttonReset, styles.routeFieldButton]}>
              <Text style={styles.dropoffLabel}>Drop-off</Text>
              <TextInput
                value={destination}
                onChangeText={value => {
                  setDestination(value);
                  setActiveField('destination');
                  setMessage('');
                }}
                onFocus={() => setActiveField('destination')}
                placeholder="Choose a destination"
                placeholderTextColor={Global.AppTheme.login_placeholder_color}
                style={styles.routeInput}
                returnKeyType="done"
              />
            </HShadowButton>
          </View>
          <HShadowButton
            accessibilityRole="button"
            accessibilityLabel="Swap pickup and drop-off"
            buttonCallback={swapLocations}
            buttonstyle={[styles.buttonReset, styles.swapButton]}>
            <Icons.FontAwesome5
              name="exchange-alt"
              color={Global.AppTheme.login_heading_color}
              size={19}
            />
          </HShadowButton>
        </View>

        <View style={styles.actionsRow}>
          <HShadowButton
            accessibilityRole="button"
            disabled={isFindingLocation}
            accessibilityState={{ disabled: isFindingLocation }}
            buttonCallback={useCurrentLocation}
            buttonstyle={[styles.buttonReset, styles.actionButton]}>
            {isFindingLocation ? (
              <ActivityIndicator color={Global.AppTheme.login_heading_color} />
            ) : (
              <Icons.FontAwesome5
                name="crosshairs"
                color={Global.AppTheme.login_heading_color}
                size={18}
              />
            )}
            <Text style={styles.actionText}>
              {isFindingLocation ? 'Locating…' : 'Use current'}
            </Text>
          </HShadowButton>
          <HShadowButton
            accessibilityRole="button"
            buttonCallback={() => {
              setMapPickerVisible(true);
            }}
            buttonstyle={[styles.buttonReset, styles.actionButton]}>
            <Icons.FontAwesome5
              name="map"
              color={Global.AppTheme.login_heading_color}
              size={18}
            />
            <Text style={styles.actionText}>Pick on map</Text>
          </HShadowButton>
        </View>

        <Text style={styles.listHeading}>
          Set as {activeField === 'pickup' ? 'pickup' : 'drop-off'}
        </Text>
        {renderSuggestions(false)}
      </ScrollView>

      {message ? <Text style={styles.message}>{message}</Text> : null}
      <View style={styles.footer}>
        <HShadowButton
          accessibilityRole="button"
          accessibilityState={{ disabled: !pickup.trim() || !destination.trim() }}
          disabled={!pickup.trim() || !destination.trim()}
          buttonCallback={proceed}
          buttonstyle={[
            styles.buttonReset,
            styles.nextButton,
            ( !pickup.trim() || !destination.trim() ) && styles.nextButtonDisabled,
          ]}>
          <Text
            style={[
              styles.nextText,
              (!pickup.trim() || !destination.trim()) && styles.nextTextDisabled,
            ]}>
            Next
          </Text>
        </HShadowButton>
      </View>

      <Modal
        transparent
        visible={mapPickerVisible}
        animationType="slide"
        onRequestClose={() => setMapPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pick a location</Text>
              <HShadowButton
                accessibilityRole="button"
                accessibilityLabel="Close map picker"
                buttonCallback={() => setMapPickerVisible(false)}
                buttonstyle={styles.buttonReset}>
                <Icons.FontAwesome
                  name="times"
                  color={Global.AppTheme.login_icon_color}
                  size={20}
                />
              </HShadowButton>
            </View>
            <Text style={styles.modalSubtitle}>
              Choose a map pin or saved place for your {activeField === 'pickup' ? 'pickup' : 'drop-off'}.
            </Text>
            <View style={styles.mapPreview} accessibilityLabel="Illustrative location map">
              <View style={styles.mapWater} />
              <View style={styles.mapLand} />
              <View style={[styles.mapRoad, styles.mapRoadOne]} />
              <View style={[styles.mapRoad, styles.mapRoadTwo]} />
              <View style={[styles.mapRoad, styles.mapRoadThree]} />
              {mapMarkers.map(({ location, top, left }) => (
                <HShadowButton
                  key={location.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${location.name}`}
                  buttonCallback={() => selectLocation(location.name)}
                  buttonstyle={[styles.mapMarker, { top, left }]}>
                  <Icons.FontAwesome5
                    name="map-marker-alt"
                    color={Global.AppTheme.login_primary_color}
                    size={25}
                  />
                </HShadowButton>
              ))}
            </View>
            <ScrollView
              style={styles.mapSuggestions}
              keyboardShouldPersistTaps="handled">
              {renderSuggestions(true)}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  buttonReset: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    maxWidth: '100%',
  },
  screen: {
    flex: 1,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 22,
    backgroundColor: Global.AppTheme.login_surface_color,
  },
  title: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
  },
  subtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 15,
    marginTop: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginBottom: 8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  routeCard: {
    minHeight: 198,
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    backgroundColor: Global.AppTheme.login_surface_color,
  },
  routeMarkerColumn: {
    width: 24,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 8,
  },
  pickupDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: Global.AppTheme.login_primary_color,
    zIndex: 1,
  },
  routeLine: {
    flex: 1,
    width: 2,
    backgroundColor: Global.AppTheme.login_border_color,
  },
  dropoffMarker: {
    width: 13,
    height: 13,
    borderRadius: 3,
    backgroundColor: Global.AppTheme.login_heading_color,
    zIndex: 1,
  },
  routeFields: {
    flex: 1,
    marginLeft: 10,
    marginRight: 46,
  },
  routeField: {
    flex: 1,
    justifyContent: 'center',
  },
  routeFieldButton: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  pickupLabel: {
    color: Global.AppTheme.login_link_color,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  dropoffLabel: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  routeInput: {
    padding: 0,
    color: Global.AppTheme.login_heading_color,
    fontSize: 16,
    minHeight: 30,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Global.AppTheme.login_border_color,
  },
  swapButton: {
    position: 'absolute',
    right: 16,
    top: '40%',
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: Global.AppTheme.login_background_color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    backgroundColor: Global.AppTheme.login_surface_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionText: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 14,
    fontWeight: '600',
  },
  listHeading: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  locationList: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: Global.AppTheme.login_surface_color,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
  },
  locationRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Global.AppTheme.login_border_color,
  },
  lastLocationRow: {
    borderBottomWidth: 0,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Global.AppTheme.login_background_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationDetails: {
    flex: 1,
    minWidth: 0,
  },
  locationName: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 15,
    fontWeight: '600',
  },
  locationAddress: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 13,
    marginTop: 5,
  },
  emptyText: {
    color: Global.AppTheme.login_subtitle_color,
    padding: 18,
    fontSize: 14,
  },
  message: {
    color: Global.AppTheme.error_color,
    fontSize: 13,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Global.AppTheme.login_surface_color,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Global.AppTheme.login_border_color,
  },
  nextButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Global.AppTheme.login_border_color,
  },
  nextText: {
    color: Global.AppTheme.login_surface_color,
    fontSize: 17,
    fontWeight: '700',
  },
  nextTextDisabled: {
    color: Global.AppTheme.login_placeholder_color,
  },
  readyContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  readyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Global.AppTheme.login_primary_color,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  readyHeading: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 24,
    fontWeight: '700',
  },
  readySubtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
  },
  tripCard: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    backgroundColor: Global.AppTheme.login_surface_color,
  },
  tripStop: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripStopDetails: {
    flex: 1,
    marginLeft: 14,
  },
  tripStopLabel: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 13,
    marginBottom: 5,
  },
  tripStopValue: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 16,
    fontWeight: '600',
  },
  tripDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Global.AppTheme.login_border_color,
    marginLeft: 28,
  },
  editTripButton: {
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  editTripText: {
    color: Global.AppTheme.login_link_color,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Global.AppTheme.login_border_color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Global.AppTheme.login_overlay_color,
  },
  modalCard: {
    maxHeight: '78%',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Global.AppTheme.login_background_color,
  },
  mapPreview: {
    height: 190,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#ded9c8',
    marginBottom: 14,
  },
  mapWater: {
    position: 'absolute',
    right: 0,
    width: '30%',
    height: '100%',
    backgroundColor: '#a8ccdc',
    borderTopLeftRadius: 90,
    borderBottomLeftRadius: 60,
  },
  mapLand: {
    position: 'absolute',
    left: '5%',
    top: '15%',
    width: '70%',
    height: '65%',
    borderRadius: 50,
    backgroundColor: '#c8d7b8',
  },
  mapRoad: {
    position: 'absolute',
    height: 5,
    width: '120%',
    left: '-10%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  mapRoadOne: {
    top: '28%',
    transform: [{ rotate: '12deg' }],
  },
  mapRoadTwo: {
    top: '55%',
    transform: [{ rotate: '-10deg' }],
  },
  mapRoadThree: {
    top: '78%',
    transform: [{ rotate: '5deg' }],
  },
  mapMarker: {
    position: 'absolute',
    width: 40,
    height: 42,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  mapSuggestions: {
    flexShrink: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: Global.AppTheme.login_heading_color,
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: Global.AppTheme.login_subtitle_color,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
});
