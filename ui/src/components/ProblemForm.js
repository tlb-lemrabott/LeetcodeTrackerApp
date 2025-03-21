import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProblem } from "../store/problemSlice";
import "./styles/ProblemForm.css";

const ProblemForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [problem, setProblem] = useState({
    problemName: "",
    link: "",
    level: "EASY",
    status: "TODO",
    comment: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProblem(problem));
    setProblem({ problemName: "", link: "", status: "TODO", comment: "" });
    onClose();
  };

  return (
    <div className="problem-form-modal">
      <div className="problem-form-content">
        <button className="problem-form-close" onClick={onClose}>×</button>
        <h2>Add Problem</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Problem Name"
            value={problem.problemName}
            onChange={(e) => setProblem({ ...problem, problemName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="LeetCode Link"
            value={problem.link}
            onChange={(e) => setProblem({ ...problem, link: e.target.value })}
            required
          />
          <select
            value={problem.level}
            onChange={(e) => setProblem({ ...problem, level: e.target.value })}
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
          <select
            value={problem.status}
            onChange={(e) => setProblem({ ...problem, status: e.target.value })}
          >
            <option value="TODO">TO-DO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
          <input
            type="text"
            placeholder="Comment"
            value={problem.comment}
            onChange={(e) => setProblem({ ...problem, comment: e.target.value })}
          />
          <button type="submit">Add Problem</button>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm;