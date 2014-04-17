//
//  UIFMQTTClient.m
//  UIF
//
//  Created by Rob Smart on 31/10/2011.
//  Copyright 2011 IBM. All rights reserved.
//

#import "MQTTClientWrapper.h"


#import <stdio.h>
#import <signal.h>
#import <memory.h>
#import <sys/time.h>
#import <stdlib.h>


@implementation MQTTClientWrapper


@synthesize listener;
MQTTClient_connectOptions opts = MQTTClient_connectOptions_initializer; // connection


- (id)init {
	if ((self = [super init])) {
		refToSelf = self;
	}
	return self;
}

int onmessage(void* context, char* topicName, int topicLen, MQTTClient_message* m)
{
    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
    NSString *topicNameNS = [NSString stringWithUTF8String:topicName];
    NSNumber *qosNS = [NSNumber numberWithInt: m->qos];
    NSNumber *retained = [NSNumber numberWithInt: m->retained];
     
    char messageBuffer[m->payloadlen];
    sprintf(messageBuffer,"%.*s", m->payloadlen, (char*)m->payload);
    NSString *messageString = [NSString stringWithCString:messageBuffer encoding:NSUTF8StringEncoding];
    
    // callback
    if ([[refToSelf listener] receive: topicNameNS message:messageString QOS:qosNS retained:retained] == NO) {
        return 0; // listener could not receive message
    }
    
    MQTTClient_freeMessage(&m);
    MQTTClient_free(topicName);
    
    [pool release];
    return 1;

}

// called if the mqtt connection is lost for any reason
void onconnectionlost(void *context, char *cause)
{
    printf("\nConnection lost\n");
    printf("     cause: %s\n", cause);
    
    // fire connectionLost callback
    [[refToSelf listener] connectionLost];
    
}

void messageDelivered(void *context, MQTTClient_deliveryToken token)
{
    printf("Message with token value %d delivery confirmed\n", token);
    
}

/**
 * a crash can happen if address is not in a proper format, get application to validate
 */
- (BOOL)create:(NSString *)clientId brokerAddress:(NSString *)broker {
	int rc;
	
	// no persistence - if QoS quality is desired, implement one
    rc = MQTTClient_create(&client, (char *) [broker UTF8String], (char *) [clientId UTF8String], MQTTCLIENT_PERSISTENCE_NONE, NULL);
	
	if (rc != MQTTCLIENT_SUCCESS) {
		MQTTClient_destroy(&client);
		return NO;
	}
		
	return YES;
}

/*
 Connect options
 cleanSession (Boolean)
 If true (default), the server should not persistent state any state associated with the client. When the client disconnects, all messages in-flight are deleted and all subscriptions are removed. 
 If false, the server persists this state between connections
 keepAliveInterval (Number)
 The number of seconds of inactivity between client and server before the connection is deemed to be broken. The client automatically sends a heart-beat message to ensure the connection remains active. 
 If not specified, a default of value of 60 seconds is used.
 userName (String)
 Authentication username for this connection.
 password (String)
 Authentication password for this connection.
 willTopic (String)
 willMessage (String)
 willQoS (Number, default: 0)
 willRetain (Boolean, default false)
 */
- (BOOL)connect:(NSMutableDictionary*)options {
	int rc;
    
    // ask for callback - messages for now
	MQTTClient_setCallbacks(client, NULL, onconnectionlost, onmessage, messageDelivered);
  /*  
    MQTTClient_willOptions *willOpts = MQTTClient_willOptions_initializer;
    opts.will = willOpts;
   */
    NSLog(@"MQTTClient_connect options:");
    for(id key in options) {
        id value = [options objectForKey:key];
        
        NSLog(@"options key %@",key);
        NSLog(@"options %@",value);
        
        if([key isEqualToString:@"cleanSession"]){
            opts.cleansession = [value intValue];
        }
        
        if([key isEqualToString:@"keepAliveInterval"]){
            opts.keepAliveInterval = [value intValue];
        }
        
        if([key isEqualToString:@"userName"]){
            opts.username= (char *) [value UTF8String];
        }
        
        if([key isEqualToString:@"password"]){
            opts.password = (char *) [value UTF8String];
        }
       /* 
        if([key isEqualToString:@"willTopic"]){
            willOpts.topicName = (char *) [value UTF8String];
        }
        
        if([key isEqualToString:@"willMessage"]){
           willOpts.message = (char *) [value UTF8String];
        }
        
        if([key isEqualToString:@"willQoS"]){
            willOpts.qos = [value intValue];
        }
        
        if([key isEqualToString:@"willRetain"]){
            willOpts.retained = [value intValue];
        }*/
    }

	rc = MQTTClient_connect(client, &opts);
	
	if (rc != MQTTCLIENT_SUCCESS) {
        NSLog(@"Connect failed code %d",rc);
		MQTTClient_destroy(&client);
		return NO;
	}

	return YES;
}

- (BOOL)isConnected {

    int rc = MQTTClient_isConnected(client);
    if(rc == MQTTCLIENT_CONNECTED) {
        return YES;
    }
    else {
        return NO;
    }
}

- (void)disconnect {
	MQTTClient_disconnect(client, 0);	
	MQTTClient_destroy(&client);	
}

- (BOOL)publish:(NSString *)topic message:(NSString *)msg QOS:(NSNumber *)qos isRetained:(BOOL)retained {
	int rc;
    
	MQTTClient_message pubmsg = MQTTClient_message_initializer;
	MQTTClient_deliveryToken dt;
	
	char *payload = (char *) [msg UTF8String];
	pubmsg.payload = payload;
	pubmsg.payloadlen = [msg lengthOfBytesUsingEncoding:NSUTF8StringEncoding];
	pubmsg.qos = qos;
	if (retained) {
		pubmsg.retained = 1;
	} else {
		pubmsg.retained = 0;
	}
	MQTTClient_publishMessage(client, (char *) [topic UTF8String], &pubmsg, &dt);
	rc = MQTTClient_waitForCompletion(client, dt, 5000L); // wait for 5 seconds
	
	if (rc != MQTTCLIENT_SUCCESS) {
		return NO;
	}
	
	return YES;
}

- (BOOL)subscribe:(NSString *)topic QOS:(NSNumber *)qos {
	int rc;
	
	rc = MQTTClient_subscribe(client, (char *) [topic UTF8String], [qos intValue]);
	
	if (rc != MQTTCLIENT_SUCCESS) {
        NSLog(@"Subscribe failed error code is %d",rc);
		return NO;
	}
	
	return YES;
}

- (BOOL)unsubscribe:(NSString *)topic {
	int rc;
	
	rc = MQTTClient_unsubscribe(client, (char *) [topic UTF8String]);
	
	if (rc != MQTTCLIENT_SUCCESS) {
        NSLog(@"Unsubscribe failed error code is %d",rc);
		return NO;
	}
	
	return YES;
}
- (void) dealloc
{
    [super dealloc];
}
@end

