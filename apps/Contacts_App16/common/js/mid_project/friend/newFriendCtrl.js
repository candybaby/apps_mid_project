app.controller('NewFriendCtrl', function($scope, FriendManager, Notification, Contacts, acLabMember, SettingManager) {
		$scope.model = {};
		$scope.init = function() {
			$scope.host = SettingManager.getHost();
		};

		$scope.onCreateClick = function() {
			if (!$scope.model.name || !$scope.model.phone) {
				Notification.alert("請輸入姓名及電話", null, '警告', '確定');
				return;
			}
			FriendManager.add($scope.model, $scope.addFriendSuccess, $scope.addFriendError);
			
		};

		$scope.addFriendSuccess = function(phone) {
			acLabMember.sendInvite($scope.host.phone, $scope.host.name, phone);
			console.log("phone:" + $scope.host.phone + " name:" + $scope.host.name + " ppp:" + $scope.model.phone);
			$scope.model = {};
			Notification.alert("新增朋友成功", null, '提示', '確定');
		};

		$scope.addFriendError = function() {
			Notification.alert("新增朋友失敗：可能已經加入為朋友了", null, '提示', '確定');
			console.log("addFriendError");
		};
	
		$scope.setFriendsFromContacts = function() {
        	var options = new ContactFindOptions();
        	options.multiple = true;
        	options.filter = "";
        	var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        	Contacts.find(fields, $scope.onSetFriendsFromContactsSuccess, $scope.onSetFriendsFromContactsError, options);
		};

    	$scope.onSetFriendsFromContactsSuccess = function(contactArray) {
        	for (var i = 0, max = contactArray.length; i < max; i++) {
        		var contactName = contactArray[i].displayName;
        		if (!contactName)
        			continue;
        		var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        		if (!mobileNumber)
        			continue;
            	var friend = {
                	name: contactName,
                	phone: mobileNumber,
                	email: (contactArray[i].emails && contactArray[i].emails.length > 0) ? contactArray[i].emails[0].value : "",
                	birthday: contactArray[i].birthday
            	};
            	FriendManager.add(friend, $scope.addFriendFromContactsSuccess);
        	}
			Notification.alert("匯入朋友成功", null, '提示', '確定');
    	};

    	$scope.addFriendFromContactsSuccess = function(phone) {
			acLabMember.sendInvite($scope.host.phone, $scope.host.name, phone);
			console.log("phone:" + $scope.host.phone + " name:" + $scope.host.name + " ppp:" + phone);
		};
	
		var getMobileNumber = function(phoneNumbers) {
			if (!(phoneNumbers instanceof Array))
				return null;
			for (var i = 0, max = phoneNumbers.length; i < max; i++) {
				if (phoneNumbers[i].type == 'mobile')
					return phoneNumbers[i].value;
			}
			return null;
		};
    
    	$scope.onSetFriendsFromContactsError = function(e) {
        	console.log(e);
    	};
	}
);

