import React, {useState} from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
// import './App.css';

const Test = () => {
  const [histogramData, setHistogramData] = useState([]);


  const fetchData = async () => {
    document.getElementById("chart").style.display = 'flex';
    document.getElementById("btn").style.display= 'none';
    try {
      let resp = await axios.get("https://www.terriblytinytales.com/test.txt");
      let req = await resp.data;
      wordFreq(req);
    } catch (error) {
      console.log(error);
    }
  };

  const wordFreq = (data) => {
    let words = data.replace(/[^a-zA-Z\s]/g, " ").split(/\s+/);
    let freq = {};
    words.forEach(function (word) {
      if (!freq[word]) {
        freq[word] = 0;
      }
      freq[word] += 1;
    });

    setHistogramData(createHistogramData(freq));
    renderFreq(freq);
  };

  const renderFreq = (freq) => {
    const entries = Object.entries(freq);
    const sort = entries.sort((a, b) => b[1] - a[1]);
    const top = sort.slice(0, 20);

    top.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  };

  const createHistogramData = (freq) => {
    const histogramData = [];
    const sort = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const top = sort.slice(0, 20);
    top.forEach(([word, Top20_words]) => {
      histogramData.push({ word, Top20_words });
    });
    return histogramData;
  };

  const exportData = () => {
    const csvData = histogramData
      .map((item) => `${item.word},${item.Top20_words}`)
      .join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "chart_data.csv");
  };

  return (
    <>
    <div className="app">
    <div className="main" id="chart">
        <div className="chart" >
          <BarChart
            width={1000}
            height={400}
            data={histogramData}
            barCategoryGap="0%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="word"
              label={{ value: "", position: "insideBottom", dy: 0 }}
            />
            <YAxis
              label={{
                  value: "Frequency",
                  angle: -90,
                  position: "insideLeft",
                  dy: 30,
                }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Top20_words" fill="#3179ff" label={null} />
          </BarChart>
        </div>
                <div className="exportbtn">
                  <button className="expbtn btn" onClick={exportData}>
                    Export
                  </button>
                </div>
      </div>
        <button className="btn" id="btn" onClick={fetchData}>Submit</button>
    </div>
    </>
  );
};

export default Test;
