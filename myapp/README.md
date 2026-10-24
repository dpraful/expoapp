# Wayfare

A mobile-first trip planning demo built with React Native, Expo SDK 58, and Expo Router for the Codenzic Innovations technical assignment.

## Requirements

- Node.js compatible with the installed Expo SDK
- npm
- Expo Go for a quick preview, or an Android/iOS development build for native testing

## Run locally

```bash
npm install
npx expo start
```

Use the Expo CLI prompts to open the app on a device, emulator, or web browser. The current-location action requires location permission and a device/browser that provides location services.

## App flow

1. **Login:** enter a valid email and a non-empty password, or create a demo account.
2. **Set locations:** enter locations manually, choose a suggested/recent place, use the device's current coordinates, or choose a saved place from the illustrative map picker.
3. **Trip ready:** review the selected start and destination, then proceed to the route.
4. **Route:** view the illustrative route, sample travel modes and estimates, and toggle the start/end navigation action.

## Demo behavior and limitations

- There is no backend. A created account is kept in app memory for the current session only; it is not persisted and must not be used with a real password.
- The location picker map, route geometry, traffic notice, travel estimates, and turn instructions are sample UI/data. The app does not provide geocoding, route calculation, traffic data, or live turn-by-turn navigation.
- Current location uses Expo Location foreground permission and displays the device coordinates as the pickup value.
- The provided Figma file is the UI reference. Review the linked design alongside the app before submitting any final visual adjustments.

## Android APK

An EAS `preview` profile is configured to produce an installable APK:

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

EAS Build runs remotely and requires an Expo account. Follow the CLI prompts to link/configure the EAS project and Android signing credentials. Download the generated APK from the build page when the build finishes. This repository does not include a prebuilt APK.

## Validation

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
```

The project uses Expo Router with route files under `src/app/Screens` and shared trip screens/components under `src/app`.
