'use strict';

export default class GroupController {
  /* @ngInject */
  constructor(GroupService, TournamentService, UserService, $mdDialog, $rootScope, $location, toaster, tournamentId) {
    this.groupService = GroupService;
    this.tournamentService = TournamentService;
    this.userService = UserService;
    this.mdDialog = $mdDialog;
    this.rootScope = $rootScope;
    this.location = $location;
    this.toaster = toaster;

    this.moderators = this.getModerators();
    this.getTournaments();
    this.selectedItem = null;
    this.querySearch = this.querySearch;
    this.groupData = {
      tournament: tournamentId
    };
    this.error = {};
  }

  getTournaments() {
    var self = this;
    this.tournamentService.getAll()
    .then(response => {
        self.groupData.tournaments = response.data;
    })
    .catch(error => {
       if (error.status === 401) {
        self.location.path('/unauthorized');
      }
    });
  }

  getModerators(query) {
   return this.userService.users(query)
   .then(response => {
      var users = response.data;
      return users.map(function(user) {
        return user;
      });
  })
  .catch(error => {
     if (error.status === 401) {
      this.location.path('/unauthorized');
    }
  });
 }

 querySearch(query) {
  return this.getModerators(query);
}

save() {
  // Create group
  var self = this;
  var data = {
    name: this.groupData.name,
    tournamentId: this.groupData.tournament,
    moderator: this.selectedItem ? this.selectedItem.id : null
  };

  this.groupService.create(data)
  .then(response => {
    this.toaster.pop('success', 'Create group', 'app/common/group/create-success.html', null, 'template');
    this.rootScope.$broadcast('addTournament');
    self.cancel();
  })
  .catch(error => {
    self.error = error.data.fieldErrors;
  });
}

cancel() {
  this.mdDialog.cancel();
}

}