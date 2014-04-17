//
//  MyAppDelegate.h
//
//

#import <Foundation/Foundation.h>
#import "WLCordovaAppDelegate.h"

@class Reachability;

@interface MyAppDelegate : WLCordovaAppDelegate {
    
}

@property (nonatomic) BOOL isNetworkConnected;
@property (assign,nonatomic) Reachability* internetReach;

@end
