const TTV_EXT_POINTS_STATS = 'TTV_EXT_POINTS_STATS';
onload = function () {
  chrome.storage.local.get([TTV_EXT_POINTS_STATS], (storageObj) => {
    if (storageObj[TTV_EXT_POINTS_STATS]) {
      const pointsObj = JSON.parse(storageObj[TTV_EXT_POINTS_STATS]);

      const chartEl = document.querySelector('#chart');
      if (chartEl.children.length !== 0) {
        chartEl.removeChild(
          chartEl.children.find((el) => el.innerText.includes('No data found'))
        );
      }

      const totalPoints = document.querySelector('#totalPointsValue');
      if (pointsObj.totalPointsCollected !== 0) {
        totalPoints.innerText = pointsObj.totalPointsCollected;
      } else {
        totalPoints.innerText = 'No points collected yet.';
      }

      new frappe.Chart('#chart', {
        data: {
          labels: pointsObj.datesStats.map((e) => e.date),
          datasets: [
            {
              name: 'Points acquired',
              chartType: 'bar',
              values: pointsObj.datesStats.map((e) => e.points),
            },
          ],
        },
        title: 'Collected points per day',
        type: 'bar',
        height: 300,
        colors: ['#6441A4'],
      });

      // wait till chart animation ends.
      setTimeout(() => {
        higlightTodaysScore();
      }, 1200);

    } else {
      const chartEl = document.querySelector('#chart');
      const newh2 = document.createElement('h2');
      const totalPoints = document.querySelector('#totalPointsValue');

      totalPoints.innerText = 'No points collected yet.';
      newh2.innerText = 'No data found, come back later.';

      chartEl.appendChild(newh2);
      chartEl.children[0].classList.add('tempText');
    }
  });
};

function higlightTodaysScore() {
  const chartdocument = document.querySelector('#chart');
  const data = chartdocument.querySelector('g.bar-chart.chart-draw-area');
  const xAxisLabels = data.querySelector('g.x.axis');
  const xAxisBars = data.querySelector(
    'g.dataset-units.dataset-bars.dataset-0'
  );
  const last_xAxisLabel =
    xAxisLabels.children[xAxisLabels.children.length - 1].children[1];

  if (last_xAxisLabel.innerHTML === getDateFromDateObj(new Date())) {
    last_xAxisLabel.innerHTML += ' Today'
    last_xAxisLabel.classList.add('golden');
    xAxisBars.children[xAxisBars.children.length - 1].classList.add('golden');
  }
}

function getDateFromDateObj(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

// DEBUG

function debugTTV() {
  chrome.storage.local.get([TTV_EXT_POINTS_STATS], (storageObj) => {
    storageObj = JSON.parse(storageObj[TTV_EXT_POINTS_STATS]);
    console.log(storageObj);
  });
}

function generateHistoricData() {
  let obj = newPointsStatObject();
  obj.datesStats.push(newDatesStatsObject("11.11.2020", 200));
  obj.datesStats.push(newDatesStatsObject("13.11.2020", 1500));
  obj.datesStats.push(newDatesStatsObject("15.11.2020", 450));
  obj.datesStats.push(newDatesStatsObject("16.11.2020", 150));
  obj.datesStats.push(newDatesStatsObject("21.11.2020", 250));
  obj.datesStats.push(newDatesStatsObject("22.11.2020", 1000));
  obj.totalPointsCollected = 3450;
  chrome.storage.local.set({
    TTV_EXT_POINTS_STATS: JSON.stringify(obj),
  });
}

function newDatesStatsObject(date, points) {
  return {
    date: date,
    points: points,
  };
}

function newPointsStatObject() {
  return {
    totalPointsCollected: 0,
    datesStats: [],
  };
}