/*
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

//
//  main.m
//  PhoneGapTestClient
//
//  Created by Benny Weingarten on 8/16/10.
//  Copyright (C) Worklight Ltd. 2006-2012.  All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    
    signal(SIGPIPE, SIG_IGN);
    
    int retVal = UIApplicationMain(argc, argv, nil, @"MyAppDelegate");
    [pool release];
    return retVal;
}