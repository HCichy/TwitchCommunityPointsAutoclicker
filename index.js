const TTV_EXT_POINTS_STATS = 'TTV_EXT_POINTS_STATS';

function setup() {
  console.info('Starting community points clicker!');
  // Search for button every 5s. TODO: configurable???
  setInterval(() => {
    getAndClickCommunityBtn();
  }, 5000);
  console.info('Initialization completed! 🤑');
}

function getAndClickCommunityBtn() {
  let communityPointsGroup = document.querySelector(
    'div.community-points-summary'
  );
  if (communityPointsGroup) {
    let communityPointsButton = communityPointsGroup.querySelectorAll('button');
    if (communityPointsButton[1]) {
      communityPointsButton[1].click();
      updatePointsStats();
      console.info('Clicked!');
    }
  }
}

function updatePointsStats() {
  let today = getDateFromDateObj(new Date());

  chrome.storage.local.get([TTV_EXT_POINTS_STATS], (storageObj) => {
    storageObj = JSON.parse(storageObj[TTV_EXT_POINTS_STATS]);
    if (Object.keys(storageObj).length !== 0) {
      let todaysPoints = storageObj.datesStats.find(
        (e) => e.date == today
      );
      storageObj.totalPointsCollected += 50;
      if (!todaysPoints) {
        storageObj.datesStats.push(newDatesStatsObject());
      } else {
        todaysPoints.points += 50;
        storageObj.datesStats.forEach((e) => {
          if (e.date === today) e = todaysPoints;
        });
      }
      chrome.storage.local.set({
        TTV_EXT_POINTS_STATS: JSON.stringify(storageObj),
      });
    } else {
      chrome.storage.local.set({
        TTV_EXT_POINTS_STATS: JSON.stringify(newPointsStatObject()),
      });
    }
  });
}

function newDatesStatsObject() {
  return {
    date: getDateFromDateObj(new Date()),
    points: 50,
  };
}

function newPointsStatObject() {
  return {
    totalPointsCollected: 50,
    datesStats: [newDatesStatsObject()],
  };
}

function getDateFromDateObj(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

setup();