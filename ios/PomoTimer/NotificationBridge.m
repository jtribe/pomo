//
//  NotificationBridge.m
//  PomoTimer
//
//  Created by Simon Wade on 10/12/2015.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Notification, NSObject)

RCT_EXTERN_METHOD(notify:(nonnull NSNumber *)inMillis repeatEvery:(nonnull NSNumber *)repeatEvery body:(NSString *)body)
RCT_EXTERN_METHOD(clear)

@end