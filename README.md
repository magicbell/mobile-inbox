# MagicBell Mobile Inbox

This repo contains an open source mobile client for the MagicBell API, built in React Native. You can use it as an example project on how to setup a React Native app that integrates with MagicBell notifications and push notifications via APNs and FCM.

To explore the full feature set of MagicBell, and to dive deeper into the API please refer to the [documentation](https://www.magicbell.com/docs).

<!-- omit in toc -->
## TOC

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Starting A Local Development Build](#starting-a-local-development-build)
- [Building Release Builds](#building-release-builds)
  - [CI on Xcode Cloud](#ci-on-xcode-cloud)

## Project Overview

This React Native app is set up using Expo, but does not require an Expo account to be build.

Some of the Expo benefits we tap into are:
- [Continuous Native Generation](https://docs.expo.dev/workflow/continuous-native-generation/): You will notice no `ios` or `android` folders. They are generated at build time, or by calling `npx expo prebuild`, and are based on a template, configuration in `app.json` and [config plugins](https://docs.expo.dev/config-plugins/introduction/) in NPM packages.
- [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/): This is a mature and well maintained library for adding push notification support to a React Native app. Its core functionality is around capturing device tokens and handling the user intend of opening a push notification. It's our current recommendation, but you are free to choose any other library that implements those features, or even build them yourself in native land.

All other Expo dependencies are not directly related to the notifications use case, but we use them to build a nice demo, and to further extend the app beyond its example characteristics towards a useful utility for working with MagicBell.

**Note**: Even though Expo offers web as a target platform, this project currently only focuses on iOS and Android.

## Prerequisites

In order to build the app you will need to have the native tool chains for the platforms you target for: [Xcode](https://developer.apple.com/xcode/) for iOS and [Android Studio](https://developer.android.com/studio) for Android.

You will also need [NodeJS](https://nodejs.org) and [Yarn](https://yarnpkg.com) for obvious reasons.

More details on how to set up a React Native dev environment can be found on [reactnative.dev](https://reactnative.dev/docs/set-up-your-environment).

Install the dependencies by running `yarn`.

## Starting A Local Development Build

You can simply get started by running the main dev command, `yarn start`. This will start Metro Bundler and bring up the Expo dev dashboard.

```bash
# Start Metro
yarn start
```
<details>

<summary>You will be greeted with the Expo dashboard</summary>

<pre>
yarn run v1.22.22
$ expo start -d
Starting project at /mobile-inbox
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▀▀▄▄██▄  █▀▄█▄██ ▀█▀█ ▄▄▄▄▄ █
█ █   █ ███▄█ ██▄ ▀ ▄█ ▄▀█ █▀▀█ █   █ █
█ █▄▄▄█ ██▄▀▄▀█▄  ▀▀▄▄▄▄▀ ▄ █ █ █▄▄▄█ █
█▄▄▄▄▄▄▄█ █ ▀▄▀▄▀ █ █▄█▄█▄▀▄█ █▄▄▄▄▄▄▄█
█▄▄▀▄▄▀▄██ ▄▄▀ ██   ▀▀██ ▄█ ▀▄▀▄█▀███▄█
█ █ ▀▄▄▄ █▀█ ▀ █▄ ▀▀▀▄▄ ▄ █▀▄▄ █ █▀▀█▄█
█  ▀  █▄▄▄ ▄▄▄ ▀ ██▄▄▀█▀ ██▀  ▄▄█▀▄██▄█
█▄█▄ ▀▀▄███▄ ▄▄█▄ █▄▄ ▄ ███  ▄ █▀▀▀▀  █
█▀ █▀▄ ▄▄▀  ▀▀▀ ▀ ▀▄ ██▀▄█▄▀ ▄ ▄▀█▄  ▄█
█  █▀▄ ▄▀▀  ▄▀█▀▄▄██ ▀▄▀ █ ▀▄▀▀█▀▄ █▀ █
█▀▄▄ ▀█▄▀▄ ▀█▄▄  ▀ ▄  █▄ ▀▀▀ ▄▄▄   ▀▄██
█▀█▀▀█▀▄ █▀▄█▄█ ▄▀  ▀ ██▄██▀▄██ ▀█▀▀█ █
█ ▀▀█▄▄▄█▄ ██▀▄▄▀█▀  ▄▄█▀ ▀▀  ▀▄█▀ ▀███
█ ▄ ▀ ▀▄▄█▄▀█▀▀ ▄▀▄▀ ▀▄▄█▄██▄██▀▀▀  █ █
█▄█▄███▄▄▀▀█ ▄██▄█▀▄▀██▀▄█ ██ ▄▄▄  ▄▄██
█ ▄▄▄▄▄ ██▄█▀▄ ▄ ██  █▄▀ ▄ ▀█ █▄█ ▄▄█ █
█ █   █ █ ▄ ▄▀ █ ▀▄▄ ▀█▄ ▄▀  ▄  ▄▄ █  █
█ █▄▄▄█ █▀▀▀ ▀ █▄▄▀ ▀ █▀ ██ █▄▀▀▄ ▀▀▀ █
█▄▄▄▄▄▄▄█▄██▄▄▄█▄▄█▄▄▄▄█▄▄███▄▄▄▄▄███▄█

› Metro waiting on x-magicbell-review://expo-development-client/?url=http%3A%2F%2F192.168.178.22%3A8081
› Scan the QR code above to open the project in a development build. Learn more

› Web is waiting on http://localhost:8081

› Using development build
› Press s │ switch to Expo Go

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.

</pre>

</details>

At this point you can use the keyboard shortcuts on the dashboard to build and open apps for iOS via `i` or Android via `a`. This will run pre-build, build and open the app in the corresponding emulator or simulator.

If you want to launch the app on a specific simulator or even device, you can use the `shift+i`/`shift+a` shortcuts, or start another build process from the terminal while keeping Metro in the background by running `yarn ios` or `yarn android` (both of which support additional parameters that can be inspected by passing `-h`).

## Sending FCM Notifications

To send notifications with FCM, you will need to configure Mobile Inbox:

You will need a [Firebase account](https://firebase.google.com/) and a Firebase Android app. 

1. You can create the Firebase Android app by using the `Add app` button on your Firebase console and selecting Android.

2. Download the `google-service.json` file.
If you're creating a new app, then, after adding your Android package name, you should see a button labelled `Download google-service.json`, which allows you to download the `google-service.json` file.
If you have a pre-registered app, you can access the Project Settings of the app and, in the General tab, locate the button to download `google-service.json` in the "Your apps" section.

3. Replace the `google-service.json` file in the root of this project with the downloaded file.

4. Do a clean build and launch the Android app:

```bash
yarn android:clean
```

5. For authentication, you will need a MagicBell user JWT. You can [generate it using your MagicBell API Key and the external ID of the user](https://www.magicbell.com/docs/api/authentication/user) you want to send notifications to. 

To test if you are receiving notifications correctly, you can use the [FCM Test](https://www.magicbell.com/test/fcm).

6. You will need an Admin SDK private key.
You can obtain it from your Firebase console. 
Click on the gear icon in the left sidebar, then navigate to the Service Accounts tab and click `Generate new private key`, which saves a JSON file to your machine. 

7. Upload the private key JSON file to the [MagicBell FCM Test](https://www.magicbell.com/test/fcm) page.

8. Copy the generated Device Token from the console running the Expo app.
The token will look like: 

```
posting token c2RAxxT6Qae-USMxxxQQhF:APA91bFxxmo7G_xBwBhiFl[...]FTrVU183-pxx4
```

9. Enter the device token on the [MagicBell FCM Test](https://www.magicbell.com/test/fcm) page and click `Send Notification.`

## Sending APNs Notifications

To send APNs Notifications, you need to start by configuring the Mobile Inbox Expo app.

1. Update `appleTeamId` and the `bundleIdentifier` in the `app.json` file.
Update the Team ID to the value configured with your project.

2. Do a clean build of the iOS App:

```bash
yarn ios:clean
```

You can test the APNs Notification, using the [MagicBell APNs Test Page](https://www.magicbell.com/test/apns) and authenticating as a MagicBell user on the Mobile Inbox app.

3. Go to the [MagicBell APNs Test Page](https://www.magicbell.com/test/apns) and enter your App ID, Certificate, Key ID, Team ID, and Badge to configure APNs.

4. [Generate a userJWT](https://www.magicbell.com/docs/api/authentication/user) with your MagicBell API Key and the external ID of the user.

5. Enter the User JWT and the v2 API URL, `"https://api.magicbell.com/v2"`, and Sign In.

6. Copy the generated Device Token from the console running the Expo app.
The token will look like: 

```
posting token 801bd597ba34abf2[...]1017df7a47fd6b14cbbf
```

7. Enter the Device Token on the [MagicBell APNs Test Page](https://www.magicbell.com/test/apns), select `development` as the Installation ID and click `Send Notification.`

## Building Release Builds

Releases can be build from the native platform projects using Xcode or Android Studio. The first step is to run the native generation using `npx expo prebuild`. From there on follow the platform specific steps to build and submit. While Expo provides [a full guide](https://docs.expo.dev/guides/local-app-production/) to follow, the basic steps for iOS are laid out next:

1. Open the project in Xcode via `xed ios`
2. Make sure to connect your Apple ID in the Xcode settings under Account. That Apple ID should be a member of a development team, eligible to sign the app.
3. Build an archived build using Archive in the Product menu. This process will take a minute but will at the end open the Organizer.
4. From the Organizer you can select "Distribute App" and select your distribution target, and proceed to the form.

After this the app will be packaged and distributed to TestFlight, from where it will be available to your testers.


### CI on Xcode Cloud

The project is also set up with Xcode Cloud to trigger TestFlight builds on changes to `main`.

The workflows can be managed in AppStore Connect, by following this [link](https://appstoreconnect.apple.com/teams/1b3ae669-5b2b-4111-8642-fb78ebde9fd0/apps/6739590830/ci).


# Troubleshooting

The React Native community offers many resources that will help you navigate the most common issues:

- [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
- [Expo Troubleshooting Guide](https://docs.expo.dev/router/reference/troubleshooting/)

MagicBells own resources are also at your availability:
- The [MagicBell documentation](https://magicbell.com/docs) is a good place to start
- The [MagicBell community](https://magicbell.com/discussions) is often the fastest way to get help

If you run into any other kind of problem, please [open an issue](https://github.com/magicbell/mobile-inbox/issues/new).

# License

This project is build by [MagicBell, Inc.](https://www.magicbell.com) and it's [contributors](./graphs/contributors).

It is released under the [MIT license](./LICENSE).