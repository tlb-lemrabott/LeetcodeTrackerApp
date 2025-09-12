import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProblem } from "../../store/problemSlice";
import "./ProblemForm.css";

const UpdateProblemForm = ({ problem, onClose }) => {
  const dispatch = useDispatch();
  const [updatedProblem, setUpdatedProblem] = useState(problem);

  useEffect(() => {
    setUpdatedProblem(problem);
  }, [problem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProblem(updatedProblem));
    onClose();
  };

  return (
    <div className="problem-form-modal">
      <div className="problem-form-content">
        <button className="problem-form-close" onClick={onClose}>×</button>
        <h2>Update Problem</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Problem Name"
            value={updatedProblem.problemName}
            onChange={(e) => setUpdatedProblem({ ...updatedProblem, problemName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="LeetCode Link"
            value={updatedProblem.link}
            onChange={(e) => setUpdatedProblem({ ...updatedProblem, link: e.target.value })}
            required
          />
          <select
            value={updatedProblem.level}
            onChange={(e) => setUpdatedProblem({ ...updatedProblem, level: e.target.value })}
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
          <select
            value={updatedProblem.status}
            onChange={(e) => setUpdatedProblem({ ...updatedProblem, status: e.target.value })}
          >
            <option value="TODO">TO-DO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
          <input
            type="text"
            placeholder="Comment"
            value={updatedProblem.comment}
            onChange={(e) => setUpdatedProblem({ ...updatedProblem, comment: e.target.value })}
          />
          <button type="submit">Update Problem</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProblemForm;