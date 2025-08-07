
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
// 引入 jsPDF 用于导出 PDF，如果未安装可根据需要替换实现
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 结果展示组件
import ShowResult from "./ShowResult";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// NOTE: shorten question list for demo
const questions = [
  { text: "I ask myself periodically if I am meeting my goals.", zh: "我会定期问自己是否达成目标" },
  { text: "I consider several alternatives to a problem before I answer.", zh: "我会在回答问题前考虑几种可能的解决办法" },
  { text: "I try to use strategies that have worked in the past.", zh: "我尝试使用过去有效的方法" },
  { text: "I pace myself while learning in order to have enough time.", zh: "我在学习过程中合理安排节奏，以确保有充足时间" },
  { text: "I understand my intellectual strengths and weaknesses.", zh: "我了解自己的认知优劣势" },
  { text: "I think about what I really need to learn before I begin a task.", zh: "我在开始任务前会思考自己真正需要学习的内容" },
  { text: "I know how well I did once I finish a test.", zh: "考试结束后我知道自己表现如何" },
  { text: "I set specific goals before I begin a task.", zh: "我在开始任务前设定明确目标" },
  { text: "I slow down when I encounter important information.", zh: "遇到重要信息时我会放慢速度" },
  { text: "I know what kind of information is most important to learn.", zh: "我知道哪些信息最重要" },
  { text: "I ask myself if I have considered all options when solving a problem.", zh: "在解决问题时我会问自己是否考虑了所有可能性" },
  { text: "I am good at organizing information.", zh: "我擅长整理信息" },
  { text: "I consciously focus my attention on important information.", zh: "我会有意识地集中注意力在重要信息上" },
  { text: "I have a specific purpose for each strategy I use.", zh: "我使用每个策略时都有明确目的" },
  { text: "I learn best when I know something about the topic.", zh: "我对某个主题已有所了解时学习效果最好" },
  { text: "I know what the teacher expects me to learn.", zh: "我知道老师希望我学到什么" },
  { text: "I am good at remembering information.", zh: "我善于记忆信息" },
  { text: "I use different learning strategies depending on the situation.", zh: "我会根据不同情况使用不同的学习策略" },
  { text: "I ask myself if there was an easier way to do things after I finish a task.", zh: "我在完成任务后会问自己是否有更简单的方法" },
  { text: "I have control over how well I learn.", zh: "我能掌控自己的学习效果" },
  { text: "I periodically review to help me understand important relationships.", zh: "我会定期复习，以帮助理解重要联系" },
  { text: "I ask myself questions about the material before I begin.", zh: "在开始学习前我会问自己一些关于材料的问题" },
  { text: "I think of several ways to solve a problem and choose the best one.", zh: "我会想出几种解决问题的方法并选择最优的" },
  { text: "I summarize what I’ve learned after I finish.", zh: "我在完成学习后会总结所学内容" },
  { text: "I ask others for help when I don’t understand something.", zh: "当我不理解某些内容时我会寻求他人帮助" },
  { text: "I can motivate myself to learn when I need to.", zh: "当我需要学习时我可以激励自己" },
  { text: "I am aware of what strategies I use when I study.", zh: "我清楚自己在学习时用的策略" },
  { text: "I find myself analyzing the usefulness of strategies while I study.", zh: "我在学习时会分析策略是否有效" },
  { text: "I use my intellectual strengths to compensate for my weaknesses.", zh: "我会用自己的优势弥补弱项" },
  { text: "I focus on the meaning and significance of new information.", zh: "我会关注新信息的意义与重要性" },
  { text: "I create my own examples to make information more meaningful.", zh: "我会创造自己的例子让信息更有意义" },
  { text: "I am a good judge of how well I understand something.", zh: "我能判断自己对内容的理解程度" },
  { text: "I find myself using helpful learning strategies automatically.", zh: "我会自动使用有帮助的学习策略" },
  { text: "I find myself pausing regularly to check my comprehension.", zh: "我会定期停下来检查是否理解" },
  { text: "I know when each strategy I use will be most effective.", zh: "我知道何时使用哪种策略最有效" },
  { text: "I ask myself how well I accomplish my goals once I’m finished.", zh: "我在完成后会问自己达成目标的程度" },
  { text: "I draw pictures or diagrams to help me understand while learning.", zh: "我会画图帮助理解" },
  { text: "I ask myself if I have considered all options after I solve a problem.", zh: "我在解决问题后会反思是否考虑了所有方案" },
  { text: "I try to translate new information into my own words.", zh: "我会用自己的话表述新信息" },
  { text: "I change strategies when I fail to understand.", zh: "当我不理解时我会改变策略" },
  { text: "I use the organizational structure of the text to help me learn.", zh: "我会利用文本结构帮助学习" },
  { text: "I read instructions carefully before I begin a task.", zh: "我在做任务前会认真阅读指令" },
  { text: "I ask myself if what I’m reading is related to what I already know.", zh: "我会思考我读的内容是否和已有知识有关" },
  { text: "I reevaluate my assumptions when I get confused.", zh: "我在困惑时会重新评估自己的假设" },
  { text: "I organize my time to best accomplish my goals.", zh: "我会规划时间以最好地完成目标" },
  { text: "I learn more when I am interested in the topic.", zh: "当我对话题感兴趣时学得更多" },
  { text: "I try to break studying down into smaller steps.", zh: "我会把学习任务拆成小步骤" },
  { text: "I focus on overall meaning rather than specifics.", zh: "我更关注整体意思而不是细节" },
  { text: "I ask myself questions about how well I am doing while I am learning something new.", zh: "我在学习新内容时会问自己掌握得如何" },
  { text: "I ask myself if I learned as much as I could have once I finish a task.", zh: "任务完成后我会反思是否学到了最多" },
  { text: "I stop and go back over new information that is not clear.", zh: "我会回头重新学习不清楚的内容" },
  { text: "I stop and reread when I get confused.", zh: "当我感到困惑时会停下来重新阅读" }
];

export default function MAIForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  // 用户个人信息
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userSchool, setUserSchool] = useState("");
  const [userGrade, setUserGrade] = useState("");

  const perPage = 10;
  const totalPages = Math.ceil(questions.length / perPage);
  const start = currentPage * perPage;
  const end = start + perPage;

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handleBack = () => setCurrentPage((prev) => prev - 1);
  const isCompleted = answers.every((a) => a !== null);

  // 定义各维度的最大题数，用于标准化得分
  const dimensionMaxScores = {
    '认知的知识': 8,
    '程序性知识': 4,
    '条件性知识': 4,
    '计划能力': 6,
    '信息管理能力': 7,
    '理解监控': 6,
    '调试策略': 5,
    '评估能力': 11,
  };

  // 各维度对应的题目序号（1-based）
  const categories = {
    '认知的知识': [1, 4, 9, 10, 15, 17, 20, 33],
    '程序性知识': [11, 12, 13, 14],
    '条件性知识': [2, 3, 16, 18],
    '计划能力': [5, 6, 7, 21, 22, 32],
    '信息管理能力': [8, 23, 24, 25, 26, 27, 28],
    '理解监控': [29, 34, 35, 36, 37, 38],
    '调试策略': [39, 40, 41, 42, 43],
    '评估能力': [44, 45, 46, 47, 48, 49, 50, 51, 52],
  };

  // 计算原始得分
  const scores = Object.entries(categories).map(([label, indices]) => {
    const score = indices.reduce((sum, i) => sum + (answers[i - 1] ? 1 : 0), 0);
    return { label, score, total: indices.length };
  });

  // 计算标准化得分：原始得分 / 最大得分 * 10，保留一位小数
  const getStandardizedScores = (scoresArr) => {
    return scoresArr.map(({ label, score }) => {
      const max = dimensionMaxScores[label] || 1;
      const standardized = parseFloat(((score / max) * 10).toFixed(1));
      return { label, standardized };
    });
  };

  const standardizedScores = getStandardizedScores(scores);
  const standardizedMap = standardizedScores.reduce((acc, { label, standardized }) => {
    acc[label] = standardized;
    return acc;
  }, {});

  // 构建柱状图数据，使用标准化得分
  const chartData = {
    labels: standardizedScores.map((s) => s.label),
    datasets: [
      {
        label: 'Standardized Score',
        data: standardizedScores.map((s) => s.standardized),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  // 雷达图数据
  const radarData = {
    labels: standardizedScores.map((s) => s.label),
    datasets: [
      {
        label: 'Standardized Score',
        data: standardizedScores.map((s) => s.standardized),
        backgroundColor: 'rgba(99, 102, 241, 0.3)',
        borderColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  // 导出 CSV：导出原始得分
  const exportCSV = () => {
    const csvData = scores.map(({ label, score, total }) => ({
      Category: label,
      Score: score,
      Total: total,
    }));
    const blob = new Blob([Papa.unparse(csvData)], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'MAI_scores.csv');
  };

  // 导出 PDF，包括用户信息和得分
  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      let y = 10;
      // 用户信息
      doc.text(`姓名 Name: ${userName}`, 10, y);
      doc.text(`年龄 Age: ${userAge}`, 10, y + 10);
      doc.text(`学校 School: ${userSchool}`, 10, y + 20);
      doc.text(`年级 Grade: ${userGrade}`, 10, y + 30);
      // 得分信息
      scores.forEach(({ label, score }, idx) => {
        const line = `${label}: ${score} / ${dimensionMaxScores[label]}`;
        doc.text(line, 10, y + 50 + idx * 10);
      });
      doc.save('MAI_results.pdf');
    } catch (e) {
      console.error(e);
      alert('PDF 导出功能不可用');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {!showResult && (
        <>
          <Progress value={((currentPage + 1) / totalPages) * 100} />
          {questions.slice(start, end).map((q, idx) => {
            const i = start + idx;
            return (
              <div key={i} className="space-y-1">
                <p className="font-medium">
                  {i + 1}. {q.text} <br />
                  <span className="text-gray-500 text-sm">{q.zh}</span>
                </p>
                <div className="flex gap-4">
                  <Button
                    variant={answers[i] === true ? 'default' : 'outline'}
                    onClick={() => handleAnswer(i, true)}
                  >
                    True 是
                  </Button>
                  <Button
                    variant={answers[i] === false ? 'default' : 'outline'}
                    onClick={() => handleAnswer(i, false)}
                  >
                    False 否
                  </Button>
                </div>
              </div>
            );
          })}

          {/* 在最后一页收集用户信息 */}
          {currentPage === totalPages - 1 && (
            <div className="space-y-4 mt-4">
              <label className="block">
                姓名 Name:
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </label>
              <label className="block">
                年龄 Age:
                <input
                  type="text"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </label>
              <label className="block">
                学校 School:
                <input
                  type="text"
                  value={userSchool}
                  onChange={(e) => setUserSchool(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </label>
              <label className="block">
                年级 Grade:
                <input
                  type="text"
                  value={userGrade}
                  onChange={(e) => setUserGrade(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </label>
            </div>
          )}
          <div className="flex justify-between pt-4">
            <Button onClick={handleBack} disabled={currentPage === 0}>
              Back
            </Button>
            {currentPage < totalPages - 1 ? (
              <Button onClick={handleNext} disabled={answers.slice(start, end).some((a) => a === null)}>
                Next
              </Button>
            ) : (
              <Button onClick={() => setShowResult(true)} disabled={!isCompleted}>
                Submit
              </Button>
            )}
          </div>
        </>
      )}

      {/* 结果展示 */}
      <ShowResult
        showResult={showResult}
        chartData={chartData}
        radarData={radarData}
        scores={scores}
        standardizedMap={standardizedMap}
        exportCSV={exportCSV}
        exportPDF={exportPDF}
      />
    </div>
  );
}
