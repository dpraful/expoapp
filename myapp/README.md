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

This project uses Expo SDK 58 and Expo Router. The app entry point is `expo-router/entry`, and routes are under `src/app/Screens`. The existing app name, Android package name, icons, splash screen, and location permission configuration are defined in `app.json`.

The EAS `preview` profile in `eas.json` is configured to produce an installable Android APK. The `production` profile produces an Android app bundle (AAB), which is intended for store distribution.

To build an APK with EAS Build:

```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

EAS Build runs remotely and requires an Expo account. The project must be linked to your Expo account; run `eas build:configure` and follow its prompts if it is not linked yet. EAS can create or use Android signing credentials during setup; do not commit private signing credentials to this repository.

When the build completes, download the APK using the artifact link printed by the CLI or from the project's **Builds** page in the Expo dashboard. This repository does not include a prebuilt APK. A local Windows release build was also attempted but could not complete because a generated native C++ build path exceeded the Windows 260-character path limit; the configured cloud EAS build is the recommended APK build path.

### Build configuration checks

- `npx expo install --check`: passed; installed packages match the Expo SDK.
- `npx expo-doctor`: passed all 20 checks.
- The app's API base URL is currently a hard-coded local HTTP address in `src/app/Common/Global.js`. For device API requests to work, the backend must be reachable from the device; this does not block EAS APK generation.

## Validation

```bash
npx tsc --noEmit
npm run lint
npx expo-doctor
```

The project uses Expo Router with route files under `src/app/Screens` and shared trip screens/components under `src/app`.
