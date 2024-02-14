'use client'; 

import {useRef} from "react";
import HighchartsReact from 'highcharts-react-official';
import ExportingModule from "highcharts/modules/exporting";
import * as Highcharts from 'highcharts/highstock';

const HighChartComponent = ({ options }) => {
    const chartComponentRef = useRef(null);
 
    if (typeof Highcharts === 'object') {
        ExportingModule(Highcharts)
    }

    return (<HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
    />);
};

export default HighChartComponent;
