'use strict';

export default class ManagementController {
  /* @ngInject */
  constructor(TournamentService, CacheService, MenuService, $rootScope, AccountService, $location) {
    this.rootScope = $rootScope;
    this.location = $location;
    this.tournamentService = TournamentService;
    this.accountService = AccountService;
    this.menu = MenuService;
    this.tournaments = [];
    this.getAllTournament();
    this.selectedGroup = -1;
    this.selectedTour = -1;
    this.showView = {
      isCreate: true,
      isEdit: false,
      isGroup: false
    };
    this.cacheService = CacheService;
    this.isAdmin = false;
    this.authen();
    $rootScope.$on('addTournament', () => {
      this.getAllTournament();
    });
    
    this.autoFocusContent = false;
    this.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

  }

  isOpen(section) {
    console.log(section);
    return this.menu.isSectionSelected(section);
  }

  toggleOpen(section) {
    this.menu.toggleSelectSection(section);
  }

  isSectionSelected(section) {
    var selected = false;
    var openedSection = this.menu.openedSection;
    if(openedSection === section){
      selected = true;
    }
    else if(section.children) {
      section.children.forEach(function(childSection) {
        if(childSection === openedSection){
          selected = true;
        }
      });
    }
    return selected;
  }

  changeTournament(index) {
    this.selectedTour = (index == this.selectedTour ? -1 : index);
  }

  createTournament() {
    this.showView.isCreate = true;
    this.showView.isEdit = false;
    this.showView.isGroup = false;
  }

  showGroup(index, tournament, group) {
    this.selectedGroup = index;
    this.showView.isCreate = false;
    this.showView.isEdit = false;
    this.showView.isGroup = true;

    console.log('show Group');

    this.rootScope.$broadcast('tourID', tournament.id, group.id);
    group.tournamentName = tournament.name;
    this.rootScope.$broadcast('selectGroup', group);
  }

  isAuthorized() {
    return this.cacheService.get('loginUser')!= null;
  }

  getAllTournament() {
    this.tournamentService.findByRole()
    .then(response => {
      this.tournaments = response.data;
    })
    .catch(error => {
      if (error.status === 401) {
        this.location.path('/unauthorized');
      }
    });
  }

  showTournamenDetail(tournamentId) {
    this.showView.isEdit = true;
    this.showView.isGroup = false;
    this.showView.isCreate = false;

    console.log('showTournamenDetail');

    for (var i in this.tournaments) {
      if (this.tournaments[i].id === tournamentId) {
        this.rootScope.$broadcast('selectTournament', this.tournaments[i]);
        break;
      }
    }
  }

  authen() {
    this.accountService.authen()
    .then(response => {
      if (response.data) {
        this.isAdmin = response.data.role === 'ADMIN' ? true : false;
      }
    });
  }
}
