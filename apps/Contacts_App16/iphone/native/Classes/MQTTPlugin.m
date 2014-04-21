#import "MQTTPlugin.h"
#import "MQTTConstant.h"
#import "ContactsApp16.h"
#define DebugLog(fmt,...) NSLog(@"%@", [NSString stringWithFormat:(fmt), ##__VA_ARGS__]);
@implementation MQTTPlugin

@synthesize connected;

MQTTClientWrapper *mqttClient;
NSTimer *timer;

NSString *clientId;
NSString *topic;


#pragma mark Header Implementation Area
- (void) CONNECT: (CDVInvokedUrlCommand*)command
{
    //取得ＪＳ傳入進來的參數
    if(command.arguments!=nil && command.arguments.count==2){
        clientId = [[command.arguments objectAtIndex:0] copy];
        topic = [[command.arguments objectAtIndex:1] copy];
        
        DebugLog(@"-->CONNECT MQTT clientId:%@ topic:%@  ",clientId,topic);
        [self startMQTT: command.callbackId];
    }else{
        DebugLog(@"-->CONNECT MQTT command argument ERROR! The argument count is nil or not 3.");
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Connect MQTT Client failed"];
        
        //Call  the Success Javascript function
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void) SEND_MSG: (CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult =nil;
    if(command.arguments!=nil && command.arguments.count==2){
        NSString *topic = [command.arguments objectAtIndex:0];
        NSString *msg = [command.arguments objectAtIndex:1];
        
        if([self isConnected]){
            [mqttClient publish:topic message:msg QOS:MSG_QOS isRetained:MSG_RETAINED];
            
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        }else {
            DebugLog(@"MQTT Client is not connected...");
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"publish message failed"];
        }
    }else{
        DebugLog(@"-->SEND_MSG MQTT command argument ERROR! The argument count is nil or not 3.");
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Send MQTT MSG failed"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark Start/Stop/ReStart MQTT Connection
//開始建立ＭＱＴＴ連線，如果連線已經存在，就重先連線．
- (void) startMQTT:(NSString *) callbackID
{
    if([self isConnected]){
        [self stopMQTT];
    }
    if(clientId!=nil && topic!=nil){
        DebugLog(@"-->Start Connecting to MQTT Server!");
        if(callbackID){
            [NSThread detachNewThreadSelector:@selector(threadEntry:)
                                     toTarget:self
                                   withObject:[NSArray arrayWithObjects: callbackID, nil]];
        }else{
            [NSThread detachNewThreadSelector:@selector(threadEntry:)
                                     toTarget:self
                                   withObject:[NSArray arrayWithObjects: nil]];
        }
    }else{
        DebugLog(@"-->No Data found! MQTT Server not connected!");
    }
}
//透過Timer註冊一個重新建立ＭＱＴＴ連線的Thread.
-(void) scheduleRestart
{
    DebugLog(@"Schedule restart %d in sec...", MQTT_KEEP_ALIVE);
    dispatch_async(dispatch_get_main_queue(), ^{
        timer = [NSTimer scheduledTimerWithTimeInterval:MQTT_KEEP_ALIVE target:self selector:@selector(restartMQTT:) userInfo:nil repeats:NO];
    });
}
//馬上重先建立ＭＱＴＴ連線
-(void) restartMQTT:(NSTimer *)timer
{
    DebugLog(@"-->Restarting MQTT.");
    [self startMQTT:nil];
}

- (void) stopMQTT
{
    DebugLog(@"-->Stop Connection to MQTT Server!");
    if(mqttClient!=nil && [mqttClient isConnected]) {
        [mqttClient disconnect];
        DebugLog(@"-->mqttClient Disconnected from Server!");
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        [self sendDisconnected];
    });
}

-(void) sendConnected
{
    connected=YES;
}

-(void) sendDisconnected
{
    connected=NO;
}

// run the mqtt client in its own thread
#pragma mark MQTT Thread Method to connect the Server.
- (void)threadEntry:(NSArray *)params {
    @autoreleasepool {
        @synchronized(self){
            self.myAppDelegate = (MyAppDelegate *)[[UIApplication sharedApplication] delegate];
            if(self.myAppDelegate.isNetworkConnected) {
            //if(true) {
                if(connected)
                    return;
                
                [self stopMQTT];
                
                BOOL success = false;
                NSString *serverAddr = [NSString stringWithFormat: @"tcp://%@:%@", MQTT_HOST, MQTT_PORT];
            
                NSString *callbackID = nil;
                if(params.count==1){
                    callbackID = [params objectAtIndex:0];
                }
                
                DebugLog(@"-->Start to CONNECT to MQTT server:%@, topic:%@, callbackID:%@",serverAddr,topic,callbackID);
                
                NSMutableDictionary* options = [NSMutableDictionary dictionary];
                [options setObject:[NSNumber numberWithInt:CLEAR_SESSION] forKey:@"cleanSession"];
                [options setObject:[NSNumber numberWithInt:MQTT_KEEP_TIME_INTERVAL] forKey:@"keepAliveInterval"];
            
                if(mqttClient==nil) {
                    mqttClient = [[MQTTClientWrapper alloc] init];
                    [mqttClient setListener:self];
                }
                
                // create the mqtt client
                success = [mqttClient create:clientId brokerAddress:serverAddr];
                
                if (!success) {
                    DebugLog(@"Error: Could not create MQTT Client! Schedule restart.");
                    [self scheduleRestart];
                    // should return error via callback
                    if(callbackID != nil) {
                        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"create MQTT Client failed"];
                        
                        //Call  the Success Javascript function
                        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                    }
                    dispatch_sync(dispatch_get_main_queue(), ^{
                        [self sendDisconnected];
                    });
                    return;
                }
                
                // connect to the broker
                success = [mqttClient connect:options];
                
                if (!success) {
                    DebugLog(@"Error could not connect to server %@! Schedule restart.",serverAddr);
                    [self scheduleRestart];
                    if(callbackID != nil) {
                        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"connect failed"];
                        
                        //Call  the Success Javascript function
                        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                    }
                    dispatch_sync(dispatch_get_main_queue(), ^{
                        [self sendDisconnected];
                    });
                    return;
                } else {
                    DebugLog(@"Connected to server %@",serverAddr);
                    
                    // Subscribe Topic
                    if([mqttClient subscribe:topic QOS:[NSNumber numberWithInt:MSG_QOS]]){
                        DebugLog(@"subscribe topic %@ success", topic);
                        
                        if(callbackID != nil) {
                            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"subscribe success"];
                            
                            [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                        }
                        dispatch_sync(dispatch_get_main_queue(), ^{
                            [self sendConnected];
                        });
                    } else {
                        DebugLog(@"Fail subscribe topic %@ ! Schedule restart.", topic);
                        [self scheduleRestart];
                        if(callbackID != nil) {
                            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"subscribe fail"];
                            
                            [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
                        }
                        dispatch_sync(dispatch_get_main_queue(), ^{
                            [self sendDisconnected];
                        });
                    }
                }
            } else {
                DebugLog(@"Network unavailable, can't connect MQServer.");
                dispatch_sync(dispatch_get_main_queue(), ^{
                    [self sendDisconnected];
                    
                });
                [self scheduleRestart];
            }
        } // end of synchronized
    } // end of autoreleasepool
}

#pragma mark MQTT Callback Handler
/**
 * Method called when a connection is unexpectedly lost
 * The callback must be performed on the main thread because you can't make a uikit call (uiwebview) from another thread
 */
- (void)connectionLost
{
    DebugLog(@"Connection to broker lost! Ready to reconnect in %d sec...", MQTT_KEEP_ALIVE);
    
    if(mqttClient!=nil) {
        [mqttClient disconnect];
    }
    dispatch_sync(dispatch_get_main_queue(), ^{
        [self sendDisconnected];
        [self scheduleRestart];
    });
}

/**
 * Method called when a message is received
 * The callback must be performed on the main thread because you can't make a uikit call (uiwebview) from another thread
 */
- (BOOL)receive: (NSString *)topic message:(NSString *)msg QOS:(NSNumber *)qos retained:(NSNumber *)rtn
{
    DebugLog(@"received message %@",msg);
    dispatch_sync(dispatch_get_main_queue(), ^{
        [self.webView stringByEvaluatingJavaScriptFromString:[NSString stringWithFormat:@"receiveMessage('%@')",msg]];
    });
    return YES;
}
@end
