import React, { useState } from "react";
import { useDispatch } from "react-redux";
import UpdateProblemForm from "./UpdateProblemForm";
import { deleteProblem, updateProblem } from "../store/problemSlice";
import "./styles/ProblemList.css";

const ProblemList = ({ problems }) => {
  const dispatch = useDispatch();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const handleStatusChange = (problem, newStatus) => {
    const updatedProblem = { ...problem, status: newStatus };
    if (newStatus === "DONE") {
      updatedProblem.doneTime = new Date().toISOString();
    }
    dispatch(updateProblem(updatedProblem));
  };

  return (
    <>
    <table className="problem-table">
      <thead>
        <tr>
          <th>Problem Name</th>
          <th>LeetCode Link</th>
          <th>Level</th>
          <th>Status</th>
          <th>Time Posted</th>
          <th>Done Time</th>
          <th className="comment-column">Comment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {problems?.length > 0 ? (
          problems.map((problem) => (
            <tr key={problem.problemId}>
              <td>{problem.problemName}</td>
              <td>
                <a href={problem.link} target="_blank" rel="noopener noreferrer">
                  Solve on LeetCode
                </a>
              </td>
              <td>{problem.level}</td>
              <td>
                <select value={problem.status} onChange={(e) => handleStatusChange(problem, e.target.value)}>
                  <option value="TODO">TODO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </select>
              </td>
              <td>{problem.timePosted ? new Date(problem.timePosted).toLocaleString() : "N/A"}</td>
              <td>{problem.doneTime ? new Date(problem.doneTime).toLocaleString() : "N/A"}</td>
              <td className="comment-column">{problem.comment ? problem.comment : "N/A"}</td>
              <td>
                <button className="delete-button" onClick={() => dispatch(deleteProblem(problem.problemId))}>Delete</button>
                <button className="update-button" onClick={() => setSelectedProblem(problem)}>Update</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8">No problems found</td>
          </tr>
        )}
      </tbody>
    </table>
    {selectedProblem && (
      <UpdateProblemForm problem={selectedProblem} onClose={() => setSelectedProblem(null)} />
    )}
    </>
  );
};

export default ProblemList;