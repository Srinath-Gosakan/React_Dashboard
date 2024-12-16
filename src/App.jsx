import React, { useState } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        setHeaders(Object.keys(data[0])); // Extract headers
        setCsvData(data); // Extract data
        setFilteredData(data); // Initialize filtered data
      },
    });
  };

  const handleFilter = () => {
    if (!filterValue.trim()) {
      setFilteredData(csvData); // Reset to all data if filter is empty
      return;
    }

    const filtered = csvData.filter((row) => {
      const usageValue = parseInt(row['usage value']); // Use exact column name
      return !isNaN(usageValue) && usageValue >= parseFloat(filterValue);
    });

    setFilteredData(filtered);
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">CSV Dashboard</h1>

      {/* File Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file-input"
      />

      {/* Filter Section */}
      {csvData.length > 0 && (
        <div className="filter-container">
          <label htmlFor="filterValue">Filter by Usage Value:</label>
          <input
            type="number"
            id="filterValue"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter minimum value"
            className="filter-input"
          />
          <button onClick={handleFilter} className="filter-button">
            Apply Filter
          </button>
        </div>
      )}

      {/* Table Display */}
      {filteredData.length > 0 ? (
        <div className="table-container">
          <h2>Table Preview</h2>
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        csvData.length > 0 && <p>No data matches the filter criteria.</p>
      )}

      {/* Chart Display */}
      {filteredData.length > 0 && (
        <div className="chart-container">
          <h2>Chart Visualization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={headers[0]} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={headers[1]} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
