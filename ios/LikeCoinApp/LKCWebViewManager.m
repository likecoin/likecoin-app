//
//  LKCWebViewManager.m
//  LikeCoinApp
//
//  Created by Ng Wing Tat, David on 11/9/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "LKCWebViewManager.h"
#import "LKCWebView.h"

@interface LKCWebViewManager () <RNCWebViewDelegate>

@end

@implementation LKCWebViewManager {}

RCT_EXPORT_MODULE()

- (UIView *)view
{
  LKCWebView *webView = [LKCWebView new];
  webView.delegate = self;
  return webView;
}

- (BOOL)webView:(RNCWebView *)webView shouldStartLoadForRequest:(NSMutableDictionary<NSString *,id> *)request withCallback:(RCTDirectEventBlock)callback {
  return TRUE;
}

@end
