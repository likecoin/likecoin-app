//
//  LikerLandShare.m
//  LikerLandShare
//
//  Created by Ng Wing Tat (David) on 26/2/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>

@interface LikerLandShare : ReactNativeShareExtension
@end

@implementation LikerLandShare

RCT_EXPORT_MODULE();

- (UIView*) shareView {
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"LikerLandShare"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = nil;

  // Uncomment for console output in Xcode console for release mode on device:
  // RCTSetLogThreshold(RCTLogLevelInfo - 1);

  return rootView;
}

@end
