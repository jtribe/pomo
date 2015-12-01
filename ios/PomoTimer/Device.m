//
//  Device.m
//  PomoTimer
//
//  Created by Simon Wade on 30/11/2015.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "Device.h"

@implementation Device
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(deviceName:(RCTResponseSenderBlock)callback) {
  NSString *deviceName = [[UIDevice currentDevice] name];
  callback(@[deviceName]);
}
@end