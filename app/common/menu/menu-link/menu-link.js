'use strict';

export default class MenuLink {
  /* @ngInject */
  constructor() {
    return {
       replace: false,
       scope: {
          section: '='
        },
        controller: 'ManagementController',
        controllerAs: 'management',
      	templateUrl: 'app/common/menu/menu-link/menu-link.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.focusSection = function () {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            controller.autoFocusContent = true;
          };
        }
    };
  }
}