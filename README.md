# Pomo

## Prerequisites

- See [ReactNative docs](https://facebook.github.io/react-native/docs/getting-started.html#requirements)
- See [Anroid Setup Guide](https://facebook.github.io/react-native/docs/getting-started.html#requirements)

## Installation

```bash
npm install
```

## Running

```bash
react-native start
```

#### iOS

```bash
open ios/PomoTimer.xcodeproj/
```

Then click _Run_ to launch the iOS Simulator

#### Android

First start a Genymotion VM then run:

```bash
react-native run-android
```

## Developer Notes

### Testing

```bash
npm test -- -w # or npm test for 
```

### WebStorm

- Use Language > JavaScript > Flow
- Import the inspections config from `config/Project_Default.xml` 

## Distribution
- The Apple ID armin@jtribe.com.au is used for iTunes Connect
- This project uses match to manage certs and provisioning profiles, so it should not be necessary to add this account to Xcode
