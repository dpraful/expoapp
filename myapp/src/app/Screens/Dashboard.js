import React, { useState } from 'react';
import HView from '../HOC/HView';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();
  const [screen, setScreen] = useState('HomeScreen');
  const [tripLocations, setTripLocations] = useState({
    pickup: '',
    destination: '',
  });

  function showRoute({ pickup, destination }) {
    setTripLocations({ pickup, destination });
    setScreen('RouteScreen');
  }

  function goBack() {
    if (screen === 'RouteScreen') {
      setScreen('HomeScreen');
      return;
    }

    router.back();
  }

  return (
    <HView
      component={screen}
      style={{ flex: 1 }}
      pickup={tripLocations.pickup}
      destination={tripLocations.destination}
      onProceedToRoute={showRoute}
      onBack={goBack}
    />
  );
}
