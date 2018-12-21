import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import mockData from './mockData';


am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-chart-field',
  templateUrl: './chart-field.component.html',
  styleUrls: ['./chart-field.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChartFieldComponent implements OnInit {

  private chart: am4charts.XYChart;
  constructor(private zone: NgZone) { }



  ngOnInit() {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.showOnInit = false;
      chart.paddingRight = 20;

      var dataProvided = mockData.data.metrics.bfd.peerPath.jitter0[0].timeseries.reverse().map((d
      ) => {
        return {
          value: d.value,
          time: new Date(d.timestamp)
        };
      });
      console.log(dataProvided);
      chart.data = dataProvided;

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 1;
      dateAxis.renderer.ticks.template.location = 1;


      dateAxis.title.text = 'time';
      dateAxis.title.fontWeight = 'bold';
      dateAxis.dateFormatter = new am4core.DateFormatter();
      dateAxis.dateFormatter.dateFormat = "h:m:s";


      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;
      valueAxis.title.text = 'bandwidth';
      valueAxis.title.fontWeight = 'bold';

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "time";
      series.dataFields.valueY = "value";

      series.events.on('ready', () => {
        dateAxis.zoomToDates(
          dataProvided[dataProvided.length - 2].time,
          dataProvided[dataProvided.length - 1].time,
          false,
          true // this makes zoom instant
        );
      })

      series.tooltipText = "{valueY.value}";

      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;


      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.menu.align = "left";
      chart.exporting.menu.verticalAlign = "top";
      chart.exporting.filePrefix = "myExport";


      this.chart = chart;
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
