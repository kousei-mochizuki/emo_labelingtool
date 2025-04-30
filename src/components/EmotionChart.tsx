import React from 'react';
import { Bar } from 'react-chartjs-2';
import { EmotionLabels, emotions } from '../utils/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionChartProps {
  emotions: EmotionLabels;
}

const EmotionChart: React.FC<EmotionChartProps> = ({ emotions: emotionValues }) => {
  const labels = emotions.map(e => e.japaneseLabel);
  const data = emotions.map(e => emotionValues[e.name]);
  const backgroundColors = emotions.map(e => emotionValues[e.name] > 0 ? e.color : `${e.color}40`);
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderColor: emotions.map(e => e.color),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${value === 1 ? '選択' : '未選択'}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (tickValue: string | number) => {
            const value = Number(tickValue);
            return value === 0 ? '未選択' : '選択';
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EmotionChart;