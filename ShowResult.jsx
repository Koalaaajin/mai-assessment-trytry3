import React from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from './components/ui/button';

// 注册雷达图所需的 Chart.js 组件
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// 各维度中文名称及解释
const dimensionDescriptions = {
  '计划能力': '（是否能提前设定学习目标并合理安排时间）',
  '信息管理能力': '（是否能挑选重点信息并有效组织）',
  '理解监控': '（是否会检查自己有没有听懂）',
  '调试策略': '（遇到问题时是否会调整学习方式）',
  '评估能力': '（是否会在学习后反思效果）',
  '认知的知识': '（是否了解自己的学习风格与偏好）',
  '程序性知识': '（是否掌握具体的学习方法）',
  '条件性知识': '（是否知道在什么情境下使用哪些策略）',
};

/**
 * 结果展示组件
 * @param {object} props
 * @param {boolean} props.showResult - 控制是否展示结果
 * @param {object} props.chartData - 柱状图数据
 * @param {object} props.radarData - 雷达图数据
 * @param {Array} props.scores - 原始得分数组
 * @param {Object} props.standardizedMap - 标准化得分映射表
 * @param {Function} props.exportCSV - 导出 CSV 函数
 * @param {Function} props.exportPDF - 导出 PDF 函数
 */
const ShowResult = ({ showResult, chartData, radarData, scores, standardizedMap, exportCSV, exportPDF }) => {
  return (
    showResult && (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">你的测评结果</h2>
        {/* 雷达图 */}
        <Radar
          data={radarData}
          options={{
            responsive: true,
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 10,
                pointLabels: {
                  callback: (label) => label + (dimensionDescriptions[label] || ''),
                },
              },
            },
            plugins: {
              legend: { display: false },
            },
          }}
        />
        {/* 柱状图 */}
        <Bar
          data={chartData}
          options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 10 } },
            responsive: true,
          }}
        />
        {/* 各维度得分及说明 */}
        <ul className="text-sm text-gray-700 space-y-1">
          {scores.map((s) => {
            const standardized = standardizedMap[s.label] ?? 0;
            const description = dimensionDescriptions[s.label];
            return (
              <li key={s.label}>
                <strong>{s.label}:</strong> {s.score} / {s.total}
                <br />
                <span>（标准化得分：{standardized} / 10）</span>
                {description && (
                  <><br /><span>{description}</span></>
                )}
              </li>
            );
          })}
        </ul>
        {/* 导出按钮 */}
        <div className="flex gap-4 mt-4">
          <Button onClick={exportCSV}>导出 CSV</Button>
          <Button onClick={exportPDF}>导出 PDF</Button>
        </div>
      </div>
    )
  );
};

export default ShowResult;