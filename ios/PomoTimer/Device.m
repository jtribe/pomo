#import "Device.h"

@implementation Device
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(deviceName:(RCTResponseSenderBlock)callback) {
  NSString *deviceName = [[UIDevice currentDevice] name];
  callback(@[deviceName]);
}
@end