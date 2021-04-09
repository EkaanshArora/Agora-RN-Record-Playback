# Agora React-Native Cloud Recording

Quickstart for cloud recording of group video calls on [React Native SDK](https://facebook.github.io/react-native/) using Agora.io SDK.

The source code of Agora React Native SDK can be found [here](https://github.com/syanbo/react-native-agora).

This app uses [this backend](https://github.com/raysandeep/Agora-Cloud-Recording-Example/tree/master) for cloud recording and tokens.

## Prerequisites

* React Native >= 0.59.10
* iOS SDK 8.0+
* Android 5.0+
* A valid Agora account [Sign up](https://dashboard.agora.io/en/) for free.

Open the specified ports in [Firewall Requirements](https://docs.agora.io/en/Agora%20Platform/firewall?platform=All%20Platforms) if your network has a firewall.

### Steps to run our example

* Download and extract the zip file.
* Run `npm install` or use `yarn` to install the app dependencies in the unzipped directory.
* Navigate to `./App.tsx` and enter your App ID that we generated along with backend URL and channel name.
* Open a terminal and execute `cd ios && pod install`.
* Connect your device and run `npx react-native run-android` or `npx react-native run-ios` to start the app.


Agora [API doc](https://docs.agora.io/en/)
