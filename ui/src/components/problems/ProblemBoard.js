import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../../store/problemSlice";
import { ProblemForm, ProblemList } from "./";
import { Button, LoadingSpinner, Modal } from "../common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileExcel, faPlus } from "@fortawesome/free-solid-svg-icons";
import { apiService } from "../../services";
import { STATUS_OPTIONS, LEVEL_OPTIONS, STATUS_COLORS } from "../../constants";
import "./ProblemBoard.css";

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

  const handleExport = async (format) => {
    try {
      const blob = await apiService.exportProblems(format);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `problems.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show a toast notification here
    }
  };

  if (status === "loading") return <LoadingSpinner text="Loading problems..." />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="problem-board">
      <div className="problem-board-header">
        <div className="problem-board-controls">
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            className="add-problem-button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Problem
          </Button>

          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select 
              value={filterLevel} 
              onChange={(e) => setFilterLevel(e.target.value)}
              className="filter-select"
            >
              {LEVEL_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="export-controls">
            <Button
              variant="outline"
              onClick={() => handleExport("pdf")}
              className="export-button"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("excel")}
              className="export-button"
            >
              <FontAwesomeIcon icon={faFileExcel} />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="status-summary">
          <div className="status-item" style={{ color: STATUS_COLORS.TODO }}>
            TODO: {countByStatus("TODO")}
          </div>
          <div className="status-item" style={{ color: STATUS_COLORS.DOING }}>
            DOING: {countByStatus("DOING")}
          </div>
          <div className="status-item" style={{ color: STATUS_COLORS.DONE }}>
            DONE: {countByStatus("DONE")}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add New Problem"
        size="medium"
      >
        <ProblemForm onClose={() => setShowForm(false)} />
      </Modal>

      <ProblemList problems={filteredProblems} />

      <div className="problem-board-footer">
        <span className="total-count">Total: {totalCount}</span>
      </div>
    </div>
  );
};

export default ProblemBoard;