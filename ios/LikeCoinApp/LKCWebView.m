//
//  LKCWebView.m
//  LikeCoinApp
//
//  Created by Ng Wing Tat, David on 11/9/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "LKCWebView.h"
#import "RNCWebView+LikeCoin.h"

@interface LKCWebView ()

@end

@implementation LKCWebView {}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
  if (@available(iOS 11.0, *)) {
    if (self.sharedCookiesEnabled) {
      [webView.configuration.websiteDataStore.httpCookieStore getAllCookies: ^(NSArray<NSHTTPCookie *> *cookies) {
        for (NSHTTPCookie *cookie in cookies) {
          [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
        }
      }];
    }
  }
  [super webView:webView didFinishNavigation:navigation];
}

@end
