app.controller('NewFriendCtrl', function($scope, FriendManager, Notification, Contacts) {
		$scope.model = {};
		$scope.init = function() {
		};

		$scope.onCreateClick = function() {
			if (!$scope.model.name || !$scope.model.phone) {
				Notification.alert("請輸入姓名及電話", null, '警告', '確定');
				return;
			}
			FriendManager.add($scope.model);
			$scope.model = {};

			Notification.alert("新增朋友成功", null, '提示', '確定');
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
            	FriendManager.add(friend);
        	}
			Notification.alert("匯入朋友成功", null, '提示', '確定');
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

