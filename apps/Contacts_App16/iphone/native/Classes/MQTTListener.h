//
//  MQTTListener.h
//  UIF
//
//  Created  on 31/10/2011.
//


@protocol MQTTListener

- (BOOL)receive: (NSString *)topic message:(NSString *)msg QOS:(NSNumber *)qos retained:(NSNumber *)rtn;
- (void)connectionLost;

@optional
- (void)keepAll:(NSString *)appId msg:(NSString *)msg;
- (void)keepLast:(NSString *)appId msg:(NSString *)msg;
@end
