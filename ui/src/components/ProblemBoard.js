import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../store/problemSlice";
import ProblemForm from "./ProblemForm";
import ProblemList from "./ProblemList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import "./styles/ProblemBoard.css";

const ProblemBoard = () => {
  const dispatch = useDispatch();
  const { problems, status, error } = useSelector((state) => state.problems);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  const countByStatus = (status) => problems.filter((p) => p.status === status).length;
  const totalCount = problems.length;
  const filteredProblems = problems.filter((problem) => {
    return (
      (filterStatus === "" || problem.status === filterStatus) &&
      (filterLevel === "" || problem.level.toLowerCase() === filterLevel.toLowerCase())
    );
  });

  const handleExport = (format) => {
    const url = `http://localhost:8080/problems/export/${format}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `problems.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === "loading") return <p>Loading problems list...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="top-section">
        <div className="controls">
          <button className="add-problem-button" onClick={() => setShowForm(true)}>
            Add Problem
          </button>

          <div className="filter-bar">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Filter by Status</option>
              <option value="TODO">TODO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>

            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="">Filter by Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="export-buttons">
            <button className="export-button pdf" onClick={() => handleExport("pdf")}>
              <FontAwesomeIcon icon={faFilePdf} className="icon" /> Export as PDF
            </button>
            <button className="export-button excel" onClick={() => handleExport("excel")}>
              <FontAwesomeIcon icon={faFileExcel} className="icon" /> Export as Excel
            </button>
          </div>
        </div>
        <div className="status-summary">
          <span className="status-item">TODO: {countByStatus("TODO")}</span>
          <span className="status-item">DOING: {countByStatus("DOING")}</span>
          <span className="status-item">DONE: {countByStatus("DONE")}</span>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowForm(false)}>×</button>
            <ProblemForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      <ProblemList problems={filteredProblems} />

      <div className="total-count">
        <span>Total: {totalCount}</span>
      </div>

    </div>
  );
};

export default ProblemBoard;