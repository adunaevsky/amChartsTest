import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as moment from 'moment';

import mockData from './initialMockData';
import liveData from './liveMockData';


am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-chart-field',
  templateUrl: './chart-field.component.html',
  styleUrls: ['./chart-field.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChartFieldComponent implements OnInit {

  private chart: am4charts.XYChart;
  private dataProvided;
  constructor(private zone: NgZone) { }



  ngOnInit() {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.showOnInit = false;
      chart.paddingRight = 20;

      this.dataProvided = mockData.data.metrics.bfd.peerPath.jitter0[0].timeseries.reverse().map((d
      ) => {
        return {
          value: d.value,
          time: new Date(d.timestamp)
        };
      });
      chart.data = this.dataProvided;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 1;
      dateAxis.dateFormatter.inputDateFormat = "i";
      dateAxis.renderer.minGridDistance = 40;
      dateAxis.renderer.ticks.template.location = 0.5;
      dateAxis.tooltipDateFormat = "h:mm:ss";

      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.dateFormats.setKey("second", "ss");
      dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
      dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
      dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
      dateAxis.renderer.axisFills.template.disabled = true;
      dateAxis.renderer.ticks.template.disabled = true;

      dateAxis.title.text = 'time';
      dateAxis.title.fontWeight = 'bold';
      dateAxis.dateFormatter = new am4core.DateFormatter();
      dateAxis.dateFormatter.dateFormat = "h:m:s";
      dateAxis.interpolationDuration = 500;
      dateAxis.rangeChangeDuration = 500;


      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      valueAxis.title.text = 'Bandwidth';
      valueAxis.title.fontWeight = 'bold';
      valueAxis.interpolationDuration = 500;
      valueAxis.rangeChangeDuration = 500;
      /* valueAxis.renderer.inside = true; */
      valueAxis.renderer.minLabelPosition = 0;
      valueAxis.renderer.maxLabelPosition = 1;
      valueAxis.renderer.axisFills.template.disabled = true;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.min = 0;
      valueAxis.strictMinMax = true;

      let series = chart.series.push(new am4charts.LineSeries());
      series.align = 'center';
      series.horizontalCenter = 'left';
      series.fixedWidthGrid = true;
      series.dataFields.dateX = "time";
      series.dataFields.valueY = "value";
      series.name = 'Router 1';
      series.interpolationDuration = 500;
      series.defaultState.transitionDuration = 0;
      // series.tensionX = 0.8;

      /*       series.events.on('ready', () => {
              dateAxis.zoomToDates(
                dataProvided[dataProvided.length - 2].time,
                dataProvided[dataProvided.length - 1].time,
                false,
                true // this makes zoom instant
              );
            }) */

      chart.events.on("datavalidated", function () {
        dateAxis.zoom({ start: 10 / 15, end: 1 }, false, true);
      });


      series.tooltipText = "{valueY.value}";

      chart.cursor = new am4charts.XYCursor();
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      var marker = chart.legend.markers.template.children.getIndex(0);

      marker.strokeWidth = 1;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;


      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.menu.align = "left";
      chart.exporting.menu.verticalAlign = "top";
      chart.exporting.filePrefix = "myExport";

      //  console.log(chart);
      this.chart = chart;
      //   console.log(liveData[0]);
      /*     setTimeout(()=>{
            chart.addData( {value: liveData[0].value, time: new Date(liveData[0].timestamp)});
           
          },2000); */


      /*    
          ); */

      // bullet at the front of the line
      var bullet = series.createChild(am4charts.CircleBullet);
      bullet.circle.radius = 5;
      bullet.fillOpacity = 1;
      bullet.fill = chart.colors.getIndex(0);
      bullet.isMeasured = false;

      series.events.on("validated", function () {
        bullet.moveTo(series.dataItems.last.point);
        bullet.validatePosition();
      });



      // all the below is optional, makes some fancy effects
      // gradient fill of the series
      series.fillOpacity = 1;
      var gradient = new am4core.LinearGradient();
      gradient.addColor(chart.colors.getIndex(0), 0.2);
      gradient.addColor(chart.colors.getIndex(0), 0);
      series.fill = gradient;

      // need to set this, otherwise fillOpacity is not changed and not set
      dateAxis.events.on("datarangechanged", function () {
        am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
          label.fillOpacity = label.fillOpacity;
        })
      })


      this.startUpdates();
    });
  }

  startUpdates() {
    var mockPoint = 0;
    var mockUpdates = setInterval(() => {

      this.chart.addData({ value: liveData[mockPoint].value, time: new Date(liveData[mockPoint].timestamp) });

      mockPoint++;
      if (mockPoint === liveData.length) {
        clearInterval(mockUpdates);
      }
    }, 5000);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
