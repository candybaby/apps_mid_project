app.controller('FriendListCtrl',
	function($scope, $ionicLoading) {
		$scope.items = [];
		$scope.init = function() {
			
			document.addEventListener("deviceready", onDeviceReady, false);
        	function onDeviceReady() {
				
				$scope.show();

				var options = {
					filter: "",
 					multiple: true
				};
				var fields = ["displayname", "name", "phoneNumbers", "emails"];
			
				navigator.contacts.find(fields, onSuccess, onError, options);	
			}
		}

		function onSuccess(contactsObj) {
			var contact_name;
        	var contact_phone;
        	var contact_email;
        	var contact_photo;
        	var photo_id;
        	for( i = 0; i < contactsObj.length; i++) {
        		contact_name = getName(contactsObj[i]);
        		contact_phone = getPhone(contactsObj[i]);
        		contact_email = getEmail(contactsObj[i]);
        		photo_id = (i % 10) + 1;
        		contact_photo = "people_" + photo_id + ".png";
        		if (contact_name != "" && contact_phone != "") {
        			$scope.items.push({name: contact_name, phone: contact_phone, email: contact_email, photo: contact_photo});
        		} else {
        			contact_name = "";
        			contact_phone = "";
        			contact_email = "";
        			contact_photo = "";
        		}
        	}
        	$scope.$apply(update); // load完contacts更新畫面
		}

		function onError(contactError) {
			alert("Find Contacts Error!");
		}

		function getName(person) {
			var result = "";
			var name = person.name.formatted;
			if(name != null && name != undefined) {
				result = name;
			}
			return result;
		}

		function getPhone(person) {
			var result = "";
			var phoneNumbers = person.phoneNumbers;
			if(phoneNumbers != null && phoneNumbers.length > 0) {
                for (var i = 0; i < phoneNumbers.length; i++) {
                	if (phoneNumbers[i] != null) {
                    	result = phoneNumbers[i].value;
                	}
                }
            }
			return result;
		}

		function getEmail(person) {
			var result = "";
			var emails = person.emails;
			if(emails != null && emails.length > 0) {
                for (var i = 0; i < emails.length; i++) {
                	if (emails[i] != null) {
                    	result = emails[i].value;
                	}
                }
            }
			return result;
		}

		var update = function() {
	    	//alert('update');
	    	$scope.hide();
	  	}

	  	// Trigger the loading indicator
	  	$scope.show = function() {	  		
	    	// Show the loading overlay and text
	    	$scope.loading = $ionicLoading.show({

		    	// The text to display in the loading indicator
		      	content: '讀取中...',

		      	// The animation to use
		      	animation: 'fade-out',

		      	// Will a dark overlay or backdrop cover the entire view
		      	showBackdrop: true,

		      	// The maximum width of the loading indicator
		      	// Text will be wrapped if longer than maxWidth
		      	maxWidth: 200,

		      	// The delay in showing the indicator
	      		showDelay: 100
	    	});
	    	//alert("loading...");
	  	};
	   // Hide the loading indicator
  		$scope.hide = function(){
    		$scope.loading.hide();
  		};

	}
);

