#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

#import "MQTTClientWrapper.h"

@class MyAppDelegate;

@interface MQTTPlugin : CDVPlugin <MQTTListener>{
    BOOL connected;
}

@property (nonatomic, readonly, getter = isConnected) BOOL connected;
@property (assign,nonatomic) MyAppDelegate *myAppDelegate;

// Plugin提供對外的服務
- (void) CONNECT: (CDVInvokedUrlCommand*)command;
- (void) SEND_MSG: (CDVInvokedUrlCommand*)command;
- (void) startMQTT:(NSString *) callbackID;
- (void) stopMQTT;
@end
