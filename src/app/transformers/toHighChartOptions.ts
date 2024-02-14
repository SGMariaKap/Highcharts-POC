import { jsonData } from '../tech-analysis2.ts';
const targetsData = jsonData.targets;

  const flagsTooltipData = targetsData
  .filter((point) => point.lowtarget !== null)
  .filter((point) => point.mediumtarget !== null)
  .filter((point) => point.hightarget !== null)
  .map((point) => ({
    x: new Date(point.date).getTime(),
    low: point.lowtarget,
    medium: point.mediumtarget,
    high: point.hightarget,

  }));

export function toHighChartsOptions() {
  const seriesData = jsonData.tabGroups[0].tabCharts[0].series[0].dataPoints;
  const seriesName = jsonData.tabGroups[0].tabCharts[0].title;
  const forecastData = targetsData.map((x) => ({
    date: x.date,
    targetPrice: x.targetprice,
  }));
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const formattedData = forecastData.map((point) => ({
    x: new Date(point.date).getTime(),
    y: typeof point.targetPrice !== 'undefined' ? parseFloat(point.targetPrice) : null,
  }));

  const currentDate = new Date().toISOString().split('T')[0];

  const forecastDataFiltered = formattedData.filter((point) => {
    const pointDate = new Date(point.x);
    const formattedPointDate = formatDate(pointDate);
    return formattedPointDate > currentDate;
  });

  let flagCounter = 1;
  const flagsData = formattedData.map((point) => {
    const flagPoint = flagsTooltipData.find((flag) => flag.x === point.x);
    const lowTargetContent = flagPoint ? `<b>Low:</b> ${flagPoint.low} </br>` : '';
    const mediumTargetContent = flagPoint ? `<b>Medium:</b> ${flagPoint.medium} </br>` : '';
    const highTargetContent = flagPoint ? `<b>High:</b> ${flagPoint.high}` : '';

    return {
      x: point.x,
      y: point.y,
      title: "Target " + (flagCounter++).toString().padStart(2, '0'), // Increment counter and format as two digits
      text: lowTargetContent + mediumTargetContent + highTargetContent,
    };
  });   
      return {
        chart: {
          zoomType: 'xy',
          borderWidth: 0,
          style: {
            overflow: 'visible',
          },
          skipClone: true,
        },
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: 'Fig. 1. LME Aluminium 3-Month',
          align: 'left',
        },
        series: [
          {
            type: 'line',
            color: '#f79448',
            name: seriesName,
            showInNavigator: true,
            data: seriesData.map((point) => ({
            x: new Date(point.xValue).getTime(),
            y: point.yValue,
            })),
          },
          {
            type: 'line',
            boostThreshold: 0,
            turboThreshold: 0,
            name: 'Target price',
            color: 'violet',
            data: forecastDataFiltered,
            shape: 'squarepin',
            width: 16,
            dashStyle: 'ShortDot',
          },
          {
            type: 'flags',
            name: 'Target price &&',
            data: flagsData,
            onSeries: 'dataseries',
            shape: 'squarepin',
            boostThreshold: 0,
            turboThreshold: 0,
            color: 'violet',
            width: 80,
        },
        ],
        zones: [{
            value: 3,
            dashStyle: 'ShortDash',
          }],
          zoneAxis: "x",
        xAxis: {
          type: 'datetime',
          showInNavigator: true,
          min: new Date().setFullYear(new Date().getFullYear() - 2),
          crosshair: true,

        },
        yAxis: {
          title: {
            text: 'Price (USD/MT)',
          },
          crosshair: false,

        },
        legend: {
          enabled: false,
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            style: {
              color: '#fff', 
            }
        },
        plotOptions: {
            series: {
                turboThreshold: 0,           
                showInNavigator: true,
                pointIntervalUnit: 'day',
                pointInterval: 7,
            },
            flags: {
                accessibility: {
                  exposeAsGroupOnly: true,
                  description: 'Flagged events.',
                },
              },
         
        },
      
        exporting: {
          enabled: true,
        },
        credits: {
          enabled: false,
        },
        navigator: {
          enabled: true,
        },
      };
    }