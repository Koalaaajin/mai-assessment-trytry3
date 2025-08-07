
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// NOTE: shorten question list for demo
const questions = [
 { text: "I ask myself periodically if I am meeting my goals.", zh: "我会定期问自己是否达成目标" },
  { text: "I consider several alternatives to a problem before I answer.", zh: "我会在回答问题前考虑几种可能的解决办法" },
  { text: "I try to use strategies that have worked in the past.", zh: "我尝试使用过去有效的方法" },
  { text: "I pace myself while learning in order to have enough time.", zh: "我会合理安排时间，让自己不会拖延或赶作业。" },
  { text: "I understand my intellectual strengths and weaknesses.", zh: "我知道自己在学习中哪些方面比较擅长，哪些地方还需要加强。" },
  { text: "I think about what I really need to learn before I begin a task.", zh: "我在开始任务前会思考自己真正需要学习的内容" },
  { text: "I know how well I did once I finish a test.", zh: "考试结束后我知道自己表现如何" },
  { text: "I set specific goals before I begin a task.", zh: "开始学习前，我会先想好我想完成什么、要学会什么。" },
  { text: "I slow down when I encounter important information.", zh: "遇到重要信息时我会放慢速度" },
  { text: "I know what kind of information is most important to learn.", zh: "我知道哪些信息最重要" },
  { text: "I ask myself if I have considered all options when solving a problem.", zh: "在解决问题时我会问自己是否考虑了所有可能性" },
  { text: "I am good at organizing information.", zh: "我擅长整理信息" },
  { text: "I consciously focus my attention on important information.", zh: "我会有意识地集中注意力在重要信息上" },
  { text: "I have a specific purpose for each strategy I use.", zh: "我使用学习方法时，会知道自己为什么用这种方法。" },
  { text: "I learn best when I know something about the topic.", zh: "如果我以前学过一点这方面的知识，我会学得更快、更容易懂。" },
  { text: "I know what the teacher expects me to learn.", zh: "我知道老师希望我学到什么" },
  { text: "I am good at remembering information.", zh: "我善于记忆信息" },
  { text: "I use different learning strategies depending on the situation.", zh: "我会根据不同情况使用不同的学习策略" },
  { text: "I ask myself if there was an easier way to do things after I finish a task.", zh: "我在完成任务后会问自己是否有更简单的方法" },
  { text: "I have control over how well I learn.", zh: "我觉得我可以通过调整方法，让自己学得更好。" },
  { text: "I periodically review to help me understand important relationships.", zh: "我会定期复习，以帮助理解重要联系" },
  { text: "I ask myself questions about the material before I begin.", zh: "在学习新内容前，我会先问问自己：“这节课大概讲什么？”、“我想解决哪些问题？”" },
  { text: "I think of several ways to solve a problem and choose the best one.", zh: "我会想出几种解决问题的方法并选择最优的" },
  { text: "I summarize what I’ve learned after I finish.", zh: "我在完成学习后会总结所学内容" },
  { text: "I ask others for help when I don’t understand something.", zh: "当我不理解某些内容时我会寻求他人帮助" },
  { text: "I can motivate myself to learn when I need to.", zh: "当我需要学习时我可以激励自己" },
  { text: "I am aware of what strategies I use when I study.", zh: "我知道自己习惯用什么方式学习，比如做笔记、画图、默写等。" },
  { text: "I find myself analyzing the usefulness of strategies while I study.", zh: "我在学习时会分析策略是否有效" },
  { text: "I use my intellectual strengths to compensate for my weaknesses.", zh: "我会用自己的优势弥补弱项" },
  { text: "I focus on the meaning and significance of new information.", zh: "学习新知识时，我会去想：这个内容有什么用？对我来说重要吗？" },
  { text: "I create my own examples to make information more meaningful.", zh: "我会创造自己的例子让信息更有意义" },
  { text: "I am a good judge of how well I understand something.", zh: "我能判断自己对内容的理解程度" },
  { text: "I find myself using helpful learning strategies automatically.", zh: "有些有效的学习方法，我已经变成习惯，不用特别提醒也会去用。" },
  { text: "I find myself pausing regularly to check my comprehension.", zh: "我会定期停下来检查是否理解" },
  { text: "I know when each strategy I use will be most effective.", zh: "我知道何时使用哪种策略最有效" },
  { text: "I ask myself how well I accomplish my goals once I’m finished.", zh: "我在完成后会问自己达成目标的程度" },
  { text: "I draw pictures or diagrams to help me understand while learning.", zh: "我会画图帮助理解" },
  { text: "I ask myself if I have considered all options after I solve a problem.", zh: "我在解决问题后会反思是否考虑了所有方案" },
  { text: "I try to translate new information into my own words.", zh: "我会把刚学到的知识用自己的方式说出来，比如讲给别人听。" },
  { text: "I change strategies when I fail to understand.", zh: "当我不理解时我会改变策略" },
  { text: "I use the organizational structure of the text to help me learn.", zh: "我会通过看目录、标题、图表来理解和记住学习内容。" },
  { text: "I read instructions carefully before I begin a task.", zh: "我在做任务前会认真阅读指令" },
  { text: "I ask myself if what I’m reading is related to what I already know.", zh: "我会思考我读的内容是否和已有知识有关" },
  { text: "I reevaluate my assumptions when I get confused.", zh: "当我发现理解错了，我会停下来换个角度重新思考问题。" },
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

  const categories = {
    "Knowledge about Cognition": [1],
    "Procedural Knowledge": [2],
    "Conditional Knowledge": [3],
  };

  const scores = Object.entries(categories).map(([label, indices]) => {
    const score = indices.reduce((sum, i) => sum + (answers[i - 1] ? 1 : 0), 0);
    return { label, score, total: indices.length };
  });

  const chartData = {
    labels: scores.map((s) => s.label),
    datasets: [
      {
        label: "Your Score",
        data: scores.map((s) => s.score),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  const exportCSV = () => {
    const csvData = scores.map(({ label, score, total }) => ({
      Category: label,
      Score: score,
      Total: total,
    }));
    const blob = new Blob([Papa.unparse(csvData)], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "MAI_scores.csv");
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
                    variant={answers[i] === true ? "default" : "outline"}
                    onClick={() => handleAnswer(i, true)}
                  >
                    True
                  </Button>
                  <Button
                    variant={answers[i] === false ? "default" : "outline"}
                    onClick={() => handleAnswer(i, false)}
                  >
                    False
                  </Button>
                </div>
              </div>
            );
          })}
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

      {showResult && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Results</h2>
          <Bar data={chartData} options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 3 } },
            responsive: true,
          }} />
          <ul className="text-sm text-gray-700">
            {scores.map((s) => (
              <li key={s.label}>
                <strong>{s.label}:</strong> {s.score} / {s.total}
              </li>
            ))}
          </ul>
          <Button onClick={exportCSV} className="mt-4">
            Export as CSV
          </Button>
        </div>
      )}
    </div>
  );
}
