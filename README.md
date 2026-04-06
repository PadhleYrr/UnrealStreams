# UnrealStreams

> Stream Beyond Limits

A professional, modern Android streaming app built with React Native & Expo.

## Features
- 🎬 Stream movies and TV shows from multiple providers
- 📥 Download for offline viewing
- 🌐 Multi-language audio and subtitle support
- 🎨 Fully customisable theme with 9 accent colour presets
- 📱 Picture-in-Picture support
- 🔌 Provider extension system — install and switch providers easily

## Building

### Debug (for testing)
Trigger the **UnrealStreams — Debug Build** workflow from GitHub Actions.  
No signing secrets required — uses the default debug keystore.

### Release
Set the following repository secrets before running a release build:
| Secret | Description |
|--------|-------------|
| `KEYSTORE_BASE64` | Base64-encoded release keystore |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |
| `DISCORD_WEBHOOK` | (Optional) Discord webhook for build notifications |

## Tech Stack
React Native 0.81 · Expo 54 · NativeWind · Zustand · TanStack Query · React Navigation
