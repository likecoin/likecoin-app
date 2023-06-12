//
//  LikerLandShare.m
//  LikerLandShare
//
//  Created by Ng Wing Tat (David) on 26/2/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>

@import Firebase;

@interface LikerLandShare : ReactNativeShareExtension
@end

@implementation LikerLandShare

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  // Initialize Firebase
  if ([FIRApp defaultApp] == nil) {
    NSString *filePath;
    #ifdef DEBUG
      NSLog(@"[FIREBASE] Development mode.");
      filePath = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info" ofType:@"plist" inDirectory:@"Debug"];
    #else
      NSLog(@"[FIREBASE] Production mode.");
      filePath = [[NSBundle mainBundle] pathForResource:@"GoogleService-Info" ofType:@"plist" inDirectory:@"Release"];
    #endif

    FIROptions *options = [[FIROptions alloc] initWithContentsOfFile:filePath];
    [FIRApp configureWithOptions:options];
  }

  // Sync cookies from App
  NSArray<NSHTTPCookie *> *cookies = [[NSHTTPCookieStorage sharedCookieStorageForGroupContainerIdentifier:@"group.liker.land"] cookies];
  for (NSHTTPCookie *cookie in cookies) {
    if ([cookie.name isEqualToString:@"__session"]) {
      [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
    }
  }
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                  moduleName:@"LikerLandShare"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }
  // Uncomment for console output in Xcode console for release mode on device:
  // RCTSetLogThreshold(RCTLogLevelInfo - 1);

  return rootView;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
