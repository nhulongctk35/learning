'use strict';

export default class PlayerHistoryController {
  /* @ngInject */
  constructor() {
    this.data =  [
          { match: 'Ali Roll', competitor: 'Crab', Score: 2, Expired: '1992-3-4', Loss: 2 },
          { match: 'Lorem ipsum dolor', competitor: 'dolore', Score: 4, Expired: '1992-3-4', Loss: 1 },
          { match: ' Excepteur sint occaecat', competitor: 'Crab', Score: 2, Expired: '1992-3-4', Loss: 2 },
          { match: 'Cali Roll 3', competitor: 'Crab 2', Score: 4, Expired: '1992-3-4', Loss: 0 }
        ];
    this.sortType = 'match';
    this.sortReverse = false;
  }
}

export default class PlayerHistory {
  constructor() {
    return {
      replace: false,
      scope: true,
      controller: PlayerHistoryController,
      controllerAs: 'playerHistory',
      templateUrl: 'app/common/player-history/player-history.html'
    };
  }
}
