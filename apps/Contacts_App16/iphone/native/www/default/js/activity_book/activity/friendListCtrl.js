
/* JavaScript content from js/activity_book/activity/friendListCtrl.js in folder common */
app.controller('FriendListCtrl', function($scope, $stateParams, $window, ActivityManager, FriendManager, acLabActivity, Notification) {
	$scope.selectedFriends = [];
	
	$scope.init = function() {
		$scope.id = $stateParams["id"];
		$scope.friendList = angular.copy(FriendManager.listFriends());
	};

	$scope.onItemChanged = function (friend) {
		if (friend.selected) {
			$scope.selectedFriends[friend.id] = friend;
		} else {
			delete $scope.selectedFriends[friend.id];
		}
    };

    $scope.sendInviteButton = [{
		type: 'button-icon button-clear ion-ios7-paperplane',
		content: '完成',
		tap: function() {
			var selectedFriendArray = [];
    		for (var attrName in $scope.selectedFriends) {
            	selectedFriendArray.push($scope.selectedFriends[attrName].account);
        	}
       		console.log("selectedFriends:" + JSON.stringify(selectedFriendArray));
       		acLabActivity.invite(selectedFriendArray, $scope.id, function() {
       			Notification.alert("邀請朋友成功", function() {
       				$window.history.back();
       			}, '提示', '確定');
       		});
        }
	}];
})
.directive('tickList', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<ul class="list" ng-transclude></ul>',
            scope: {
                multiple: '@',
                selectedIcon: '@',
                $onChange: '&onChange'
            },
            controller: ['$scope', function ($scope) {
                var items = $scope.items = [];
                this.scope = $scope;

                this.addItem = function (item) {
                    items.push(item);
                };
                this.selectItem = function (item) {
                    $scope.$apply(function () {
                        if ($scope.multiple) {
                            item.$select(!item.model.selected);
                        } else {
                            var i, l = items.length;
                            for (i = 0; i < l; ++i) {
                                items[i].$select(false);
                            }
                            item.$select(true);
                        }
                    });
                }
            }]
        }
    })
    .directive('tickListItem', ['$ionicGesture', function ($ionicGesture) {
        return {
            restrict: 'E',
            require: '^tickList',
            transclude: true,
            scope: {
                selected: '@',
                $onChange: '&onChange',
                selectedIcon: '@',
                model: '='
            },
            template: '<li class="item item-icon-right" ><div ng-transclude></div><i ng-show="selected" class="icon"></i></li>',

            link: function (scope, element, attrs, tickListCtrl) {
                function tap() {
                    tickListCtrl.selectItem(scope);
                }

                scope.$select = function (value) {
                    var val = scope.model.selected;
                    scope.selected = value;
                    if (scope.model) scope.model.selected = value;
                    if (val != value) scope.$onChange(scope.model);
                };
                if (!scope.model) {
                    scope.model = {selected: scope.selected == 'true'};
                }
                //set selected icon: defined in: tickListItem -> tickList -> default
                element.find('i').addClass(scope.selectedIcon || tickListCtrl.scope.selectedIcon || 'ion-checkmark');
                tickListCtrl.addItem(scope);
                $ionicGesture.on('tap', tap, element);
            }
        }
    }]);

