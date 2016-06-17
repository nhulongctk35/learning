'use strict';

export default class roundManController {
  /* @ngInject */
  constructor($scope, RoundService, toaster, tourID, $modalInstance) {
    this.scope = $scope;
    this.RoundService = RoundService;
    this.tourCompetitor = [];
    this.tourID = 0;
    this.roundCompetitor = [];
    this.roundListData = [];
    this.roundSave = {};
    this.roundID = 0;
    this.toaster = toaster;
    this.modalInstance = $modalInstance;
    this.tourID = tourID;
  }

  remove(round,ind){
    round.competitorList.splice(ind, 1);
    this.roundCompetitor.splice(ind, 1);
  }

  addCompetitor(round) {
    var checkExist = round.competitorList.indexOf(round.competitorSelected);
    var compType = typeof round.competitorSelected;
    round.roundError = '';
    if ( checkExist === -1 && compType !== 'undefined' && round.competitorSelected !== '') {
        round.competitorList.push(round.competitorSelected);
        this.pushCompetitorIdToList(this.tourCompetitor, this.roundCompetitor, round.competitorSelected);
        round.competitorSelected = '';
        round.CompetitorError = '';
    } else if (typeof round.competitorSelected === 'undefined' || round.competitorSelected === '') {
        round.CompetitorError = 'Please select Competitor !!!';
    } else {
        round.CompetitorError = 'Competitor already exist !!!';
    }
  }

  pushCompetitorIdToList(competitorInTour, competitorInRound, competitorName ){
    for (var k = 0; k < competitorInTour.length; k++) {
      if (competitorInTour[k].name == competitorName) {
        competitorInRound.push(competitorInTour[k].id);
      }
    }
  }

  selectTour(round){
    //Load depend Competitor follow selected tour
    //remove old Competitor list, comboBox and round name
    round.competitorList = [];
    round.competitorInComboBox = [];
    round.roundList = [];
    round.name = '';
    round.roundError = '';
    round.CompetitorError = '';
    round.success = '';
    //find tournament ID
    this.RoundService.getAllTournament()
    .then(response => {
      var ind;
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].name === round.tour){
          ind = i;
         this.tourID = response.data[i].id;
        }
      }
      //add competitors to comboBox
      this.addCompetitorToComboBox(round);
      this.loadRoundComboBox(round);
      round.roundSelected = '';
    });
  }

  addCompetitorToComboBox(round){
    round.competitorInComboBox = [];
    this.RoundService.getAllCompetitor(this.tourID)
    .then(response => {
      this.tourCompetitor = response.data;
      for (var j = 0; j < response.data.length; j++) {
        round.competitorInComboBox.push(response.data[j].name);
      }
    });
  }

  loadTour(round){
    this.RoundService.getAllTournament()
    .then(response => {
      //success
      for (var i = 0; i < response.data.length; i++) {
          round.tourlist.push(response.data[i].name);
      }
    });
  }

  createRound(roundData){
    var popTitle = 'Round Management';
    this.roundSave = {
      'name': roundData.name,
      'tournamentId': this.tourID,
      'competitorIds': this.roundCompetitor
    };
    roundData.CompetitorError = '';
    roundData.roundError = '';
    this.RoundService.create(this.roundSave)
    .then(() => {
      this.toaster.pop('success', popTitle, 'Save Successfully !!!');
      //remove all old data
      roundData.competitorList = [];
      roundData.competitorInComboBox = [];
      roundData.tour = [];
      roundData.name = '';
      this.modalInstance.dismiss();
    }, function (response) {
      roundData.roundError = response.data.fieldErrors.name;
      roundData.CompetitorError = response.data.fieldErrors.competitorId;
    });
  }

  saveData(roundData){
    var popTitle = 'Round Management';
    roundData.roundListError = '';

    if (roundData.hide === true) {
      var dataUpdate = {
        'roundId': this.roundID,
        'competitorIds': this.roundCompetitor
      };
      this.RoundService.update(dataUpdate)
      .then(() => {
        //success
        this.toaster.pop('success', popTitle, 'Update Successfully !!!');
        roundData.competitorList = [];
        roundData.roundSelected = '';
        roundData.competitorSelected = '';
        this.modalInstance.dismiss();
      }, function(response){
        roundData.roundListError = response.data.fieldErrors.roundId;
      });
    } else {
      this.createRound(roundData);
    }
  }

  updateRound(data){
      data.hide = true;
      data.tourError = '';
      data.success = '';
      data.competitorList = [];
      //Load round to comboBox
      this.loadRoundComboBox(data);
  }

  loadRoundComboBox(data){
    data.roundList = [];
    this.RoundService.getRoundInTournament(this.tourID)
    .then(response => {
      for (var i = 0; i < response.data.length; i++) {
        data.roundList.push(response.data[i].name);
      }
    });
  }

  selectRound(data){
    data.competitorList = [];
    data.success = '';
    this.RoundService.getRoundInTournament(this.tourID)
    .then(response => {
      this.roundListData = response.data;
      this.loadOldCompetitorList(data);
      this.addCompetitorToComboBox(data);
      data.roundListError = '';
    });
  }

  loadOldCompetitorList(data){
    for (var i = 0; i < this.roundListData.length; i++) {
      if(this.roundListData[i].name === data.roundSelected) {
        this.roundID = this.roundListData[i].id;
        for (var j = 0; j < this.roundListData[i].competitors.length; j++) {
          data.competitorList.push(this.roundListData[i].competitors[j].name);
        }
      }
    }
  }

  cancel(){
    this.modalInstance.dismiss();
  }

}
