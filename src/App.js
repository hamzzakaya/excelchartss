// src/App.js
import LineChart from "./components/LineChart";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function App() {
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState([]);
  const [expandedChart, setExpandedChart] = useState(null); // Genişletilmiş grafik state'i

  const birtakimislemler = (saat) => {
    const totalSeconds = Math.floor(saat * 24 * 60 * 60); // Excel saatini saniyeye çevir
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const mysaat = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return mysaat;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/2509gece.xlsx"); // Make sure this path is correct and the file is in the public folder
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      const obje = {
        A8: [],
        A9: [],
        A10: [],
        A11: [],
        A12: [],
        A13: [],
        A14: [],
        A15: [],
        A16: [],
        A17: [],
        A18: [],
        A19: [],
        A20: [],
        A21: [],
        A22: [],
        "GRŞ BACA": [],
        saat: [],
      };
      jsonData.forEach((a) => {
        obje.A8.push(a["A8"]);
        obje.A9.push(a["A9"]);
        obje.A10.push(a["A10"]);
        obje.A11.push(a["A11"]);
        obje.A12.push(a["A12"]);
        obje.A13.push(a["A13"]);
        obje.A14.push(a["A14"]);
        obje.A15.push(a["A15"]);
        obje.A16.push(a["A16"]);
        obje.A17.push(a["A17"]);
        obje.A18.push(a["A18"]);
        obje.A19.push(a["A19"]);
        obje.A20.push(a["A20"]);
        obje.A21.push(a["A21"]);
        obje.A22.push(a["A22"]);
        obje["GRŞ BACA"].push(a["GRŞ BACA"]);
        obje.saat.push(birtakimislemler(a?.SAAT));
      });
      setData(obje);

      setChartData(jsonData);
    };
    fetchData();
  }, []);

  const calculateMinMax = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return "N/A";
    }
    const min = Math.floor((Math.min(...arr) - 10) / 10) * 10;
    const max = Math.ceil((Math.max(...arr) + 10) / 10) * 10;
    return `${min}-${max}`;
  };

  // Her bir grafik için özel arka plan renklerini tanımlıyoruz
  const colors = {
    A8: "#ff9f1c",
    A9: "#f9c159",
    A10: "#f6e887",
    A11: "#b0f5ba",
    A12: "#9ceaef",
    A13: "#d2d7e7",
    A14: "#afbcc1",
    A15: "#fdfdcc",
    A16: "#e3e7e7",
    A17: "#ffd7b5",
    A18: "#ccd5ae",
    A19: "#e9edc9",
    A20: "#fefae0",
    A21: "#faedcd",
    A22: "#d4a373",
    "GRŞ BACA": "#e4b19b",
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* expandedChart varsa sadece genişletilmiş grafiği gösteriyoruz, yoksa tüm grafikleri */}
      {expandedChart ? (
        <LineChart
          backgroundColor={colors[expandedChart]} // Genişletilen grafik için arka plan rengi
          yAxisData={data[expandedChart]}
          leftYAxisName={calculateMinMax(data[expandedChart])}
          rightYAxisName={expandedChart}
          xAxisData={data.saat}
          isXAxisShow={true}
          onClick={() => setExpandedChart(expandedChart)}
          isExpanded={true} // Genişletilmiş grafiğin durumunu true yapıyoruz
          onClose={() => setExpandedChart(null)} // Kapatma butonuna basıldığında genişletilmiş state sıfırlanıyor
        />
      ) : (
        Object.keys(data).map(
          (key) =>
            key !== "saat" && (
              <LineChart
                key={key}
                backgroundColor={colors[key]} // Her grafik için özel arka plan rengi
                yAxisData={data[key]}
                leftYAxisName={calculateMinMax(data[key])}
                rightYAxisName={key}
                xAxisData={data.saat}
                isXAxisShow={key === "GRŞ BACA"}
                onClick={() => setExpandedChart(key)} // Tıklandığında ilgili grafiği genişletiyoruz
              />
            )
        )
      )}
    </div>
  );
}

export default App;
