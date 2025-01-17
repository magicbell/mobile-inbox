#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <UserNotifications/UserNotifications.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MobileInbox";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // WORKAROUND ALERT
  // Due to an Apple bug, iOS apps running on macOS don't get the initial launch URL via `launchOptions in `application:didFinishLaunchingWithOptions`.
  // They get this callback though, but at the launch time no listeners are set up to handle it yet. The workaround just triggers the same URL once again.
  if ([AppDelegate isiOSAppOnMac] && !self.bridge.launchOptions[UIApplicationLaunchOptionsURLKey]) {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [RCTLinkingManager application:application openURL:url options:options];
      });
    });
  }
  
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

+ (BOOL)isiOSAppOnMac {
  if (@available(iOS 14.0, *)) {
    return NSProcessInfo.processInfo.isiOSAppOnMac;
  }

  return false;
}

@end
