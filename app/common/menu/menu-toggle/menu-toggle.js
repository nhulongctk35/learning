'use strict';

export default class MenuToggle {
  /* @ngInject */
  constructor() {
    return {
        replace: false,
	    scope: {
	        section: '='
	    },
      controller: 'ManagementController',
      controllerAs: 'management',
      templateUrl: 'app/common/menu/menu-toggle/menu-toggle.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.isOpen = function() {
          return controller.isOpen($scope.section);
        };
        $scope.toggle = function() {
          controller.toggleOpen($scope.section);
        };

       $scope.focusSection = function () {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
  }
}