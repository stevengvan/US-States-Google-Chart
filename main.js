google.charts.load("current", { packages: ["line"] });
google.charts.setOnLoadCallback(drawChart);

var statesDisplayed = {
  Alabama: false,
  Alaska: false,
  Arizona: false,
  Arkansas: false,
  California: true,
  Colorado: false,
  Connecticut: false,
  Delaware: false,
  "District of Columbia": false,
  Florida: true,
  Georgia: false,
  Hawaii: false,
  Idaho: false,
  Illinois: false,
  Indiana: false,
  Iowa: false,
  Kansas: false,
  Kentucky: false,
  Louisiana: false,
  Maine: false,
  Maryland: false,
  Massachusetts: false,
  Michigan: false,
  Minnesota: false,
  Mississippi: false,
  Missouri: false,
  Montana: false,
  Nebraska: false,
  Nevada: false,
  "New Hampshire": false,
  "New Jersey": false,
  "New Mexico": false,
  "New York": false,
  "North Carolina": false,
  "North Dakota": false,
  Ohio: true,
  Oklahoma: false,
  Oregon: false,
  Pennsylvania: true,
  "Puerto Rico": false,
  "Rhode Island": false,
  "South Carolina": false,
  "South Dakota": false,
  Tennessee: false,
  Texas: true,
  Utah: false,
  Vermont: false,
  Virginia: false,
  Washington: false,
  "West Virginia": false,
  Wisconsin: false,
};
function toggleStates(state) {
  statesDisplayed[state] = !statesDisplayed[state];
  const stateButton = document.getElementById(`${state} toggle`);
  if (statesDisplayed[state]) {
    stateButton.classList.add("state-selected");
  } else {
    stateButton.classList.remove("state-selected");
  }
  google.charts.setOnLoadCallback(drawChart);

  console.log(statesDisplayed);
}

// Render line chart

async function drawChart() {
  //Retrieve populations for all states from 2013-2019
  const response = await fetch(
    "https://datausa.io/api/data?drilldowns=State&measures=Population"
  );
  const data = await response.json();
  var statesResult = {};

  // Reformat data as map of States
  data.data.map((state, _) => {
    if (state.Year in statesResult) {
      statesResult[state.Year][state.State] = state.Population;
    } else if (state.Year !== "2020") {
      statesResult[state.Year] = { [state.State]: state.Population };
    }
  });

  // Add toggleable buttons of States for line chart
  const statesSelector = document.getElementById("states-menu");
  statesSelector.innerHTML = null;
  for (const [key, _] of Object.entries(statesResult["2013"])) {
    const stateButton = document.createElement("button");
    stateButton.textContent = key;
    stateButton.id = `${key} toggle`;
    stateButton.onclick = function () {
      toggleStates(key);
    };
    if (statesDisplayed[key]) {
      stateButton.classList.add("state-selected");
    }
    statesSelector.appendChild(stateButton);
  }

  drawStatePopulationsChart(statesResult);
}

function drawStatePopulationsChart(result) {
  let toggledStates = [];
  var data = new google.visualization.DataTable();
  data.addColumn("number", "Year");
  for (const [state, _] of Object.entries(statesDisplayed)) {
    if (statesDisplayed[state]) {
      data.addColumn("number", state);
      toggledStates.push(state);
    }
  }

  let rows = [[2013], [2014], [2015], [2016], [2017], [2018], [2019]];
  toggledStates.forEach((state) => {
    rows[0].push(result[rows[0][0]][state]);
    rows[1].push(result[rows[1][0]][state]);
    rows[2].push(result[rows[2][0]][state]);
    rows[3].push(result[rows[3][0]][state]);
    rows[4].push(result[rows[4][0]][state]);
    rows[5].push(result[rows[5][0]][state]);
    rows[6].push(result[rows[6][0]][state]);
  });

  data.addRows(rows);

  var options = {
    titleTextStyle: { color: "#FFFFFF" },
    legend: { textStyle: { color: "white" } },
    chart: {
      title: "Population History of States (2013-2019)",
      subtitle: "in millions (M)",
    },
    height: 500,
    hAxis: { format: "#,####", textStyle: { color: "#FFFFFF" } },
    vAxis: {
      textStyle: { color: "#FFFFFF" },
    },
    chartArea: {
      backgroundColor: "#20252b",
    },
    backgroundColor: "#20252b",
  };

  var chart = new google.charts.Line(
    document.getElementById("linechart_material")
  );

  chart.draw(data, google.charts.Line.convertOptions(options));
}
