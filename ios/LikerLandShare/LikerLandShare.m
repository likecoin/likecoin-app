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

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"LikerLandShare"
                                            initialProperties:nil];

  rootView.backgroundColor = [UIColor colorWithRed:40.0f/255.0f green:100.0f/255.0f blue:110.0f/255.0f alpha:1.0];

  // Uncomment for console output in Xcode console for release mode on device:
  // RCTSetLogThreshold(RCTLogLevelInfo - 1);

  return rootView;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}

@end
