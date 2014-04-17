//
//  UIFMQTTClient.m
//  UIF
//
//  Created by Rob Smart on 31/10/2011.
//  Copyright 2011 IBM. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "MQTTClient.h"
#import "MQTTListener.h" // callback for incoming messages



MQTTClient client;


id refToSelf; // identification for C functions to call Objective C functions

@interface MQTTClientWrapper : NSObject
{
   
}

@property (assign) id<MQTTListener> listener;


- (BOOL)create:(NSString *)clientId brokerAddress:(NSString *)broker;
- (BOOL)connect:(NSMutableDictionary*)options;
- (void)disconnect;
- (BOOL)publish:(NSString *)topic message:(NSString *)msg QOS:(NSNumber *)qos isRetained:(BOOL)retained;
- (BOOL)subscribe:(NSString *)topic QOS:(NSNumber *)qos;
- (BOOL)unsubscribe:(NSString *)topic;
- (BOOL)isConnected;

@end