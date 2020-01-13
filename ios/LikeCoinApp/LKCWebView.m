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

- (void)                  webView:(WKWebView *)webView
  decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction
                  decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
  if (@available(iOS 11.0, *)) {
    if (self.sharedCookiesEnabled) {
      [webView.configuration.websiteDataStore.httpCookieStore getAllCookies: ^(NSArray<NSHTTPCookie *> *cookies) {
        for (NSHTTPCookie *cookie in cookies) {
          NSLog(@"COOKIE SET %@ %@ %@ %@", cookie.domain, cookie.name, cookie.expiresDate, webView.URL.absoluteString);
          NSLog(@"COOKIE CHECK %d %d %d", [cookie.domain isEqualToString:@"liker.land"], [cookie.name isEqualToString:@"__session"], [webView.URL.absoluteString containsString:@"/oauth/redirect"]);
          if (
            [cookie.domain isEqualToString:@"liker.land"] &&
            [cookie.name isEqualToString:@"__session"] &&
            [webView.URL.absoluteString containsString:@"/oauth/redirect"]
          ) {
            NSLog(@"COOKIE CHANGE %@ %@ %@ %@", cookie.domain, cookie.name, cookie.expiresDate, webView.URL.absoluteString);
            NSMutableDictionary *cookieProperties = [NSMutableDictionary dictionary];
            [cookieProperties setObject:cookie.name forKey:NSHTTPCookieName];
            [cookieProperties setObject:cookie.value forKey:NSHTTPCookieValue];
            [cookieProperties setObject:cookie.domain forKey:NSHTTPCookieDomain];
            [cookieProperties setObject:webView.URL.absoluteString forKey:NSHTTPCookieOriginURL];
            [cookieProperties setObject:cookie.path forKey:NSHTTPCookiePath];
            [cookieProperties setObject:[NSString stringWithFormat:@"%@", @(cookie.version)] forKey:NSHTTPCookieVersion];
            NSDate *date = [NSDate date];
            NSDateComponents *comps = [[NSDateComponents alloc]init];
            comps.month = 1;
            NSCalendar *calendar = [NSCalendar currentCalendar];
            NSDate *nextMonth = [calendar dateByAddingComponents:comps toDate:date options:NSCalendarMatchNextTime];
            [cookieProperties setObject:nextMonth forKey:NSHTTPCookieExpires];
            NSHTTPCookie *newCookie = [NSHTTPCookie cookieWithProperties:cookieProperties];
            [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:newCookie];
          } else {
            [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:cookie];
          }
        }
      }];
    }
  }
  return [super webView:webView decidePolicyForNavigationAction:navigationAction decisionHandler:decisionHandler];
}

@end
