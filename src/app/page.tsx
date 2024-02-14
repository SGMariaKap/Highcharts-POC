import React from 'react';
import HighChartComponent from './components/HighChartComponent';
import {toHighChartsOptions} from './transformers/toHighChartOptions';

const Home = () => {
    
    const chartOptions = toHighChartsOptions(); 
    return (  
        <div className="container"> 
            <HighChartComponent
                options={chartOptions}/> 
        </div>
    );
};

export default Home;
