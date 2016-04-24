//
//  RCTShareManager.m
//  RewayBDS
//
//  Created by Bui Hai Nguyen on 4/1/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTShareManager.h"
#import "RCTLog.h"
@import UIKit;

@implementation RCTShareManager

RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(share:(NSDictionary *)args)
{
  NSMutableArray *objectsToShare = [NSMutableArray array];
  NSString *text = args[@"text"];
  NSURL *url = args[@"url"];
  NSString *imageUrl = args[@"imageUrl"];
  NSData * imageData;
  
  // Try to fetch image
  if (imageUrl) {
    @try {
      imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: imageUrl]];
    } @catch (NSException *exception) {
      RCTLogWarn(@"Could not fetch image.");
    }
  }
  
  // Return if no args were passed
  if (!text && !url && !imageData) {
    RCTLogError(@"[ShareManager] You must specify a text, url and/or imageUrl.");
    return;
  }
  
  if (text) {
    [objectsToShare addObject:text];
  }
  
  if (url) {
    [objectsToShare addObject:url];
  }
  
  if (imageData) {
    [objectsToShare addObject: [UIImage imageWithData: imageData]];
  }
  
  UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:objectsToShare applicationActivities:nil];
  
  UIViewController *rootController = UIApplication.sharedApplication.delegate.window.rootViewController;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [rootController presentViewController:activityVC animated:YES completion:nil];
  });
}

@end
