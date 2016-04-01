//
//  RCTShareManager.m
//  RewayBDS
//
//  Created by Bui Hai Nguyen on 4/1/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTShareManager.h"
@import UIKit;

@implementation RCTShareManager

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(share:(NSDictionary *)args)
{
  NSString *text = args[@"text"];
  NSURL *url = args[@"url"];
  
  NSArray *objectsToShare = @[text, url];
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:objectsToShare applicationActivities:nil];
  
  UIViewController *rootController = UIApplication.sharedApplication.delegate.window.rootViewController;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [rootController presentViewController:activityVC animated:YES completion:nil];
  });
}

@end
