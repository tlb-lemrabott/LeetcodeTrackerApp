import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProblem } from "../../store/problemSlice";
import { Button } from "../common";
import { useForm } from "../../hooks";
import { validation } from "../../utils";
import { PROBLEM_LEVEL, PROBLEM_STATUS } from "../../constants";
import { apiService } from "../../services";
import "./ProblemForm.css";

const ProblemForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useForm(
    {
      problemName: "",
      link: "",
      level: PROBLEM_LEVEL.EASY,
      status: PROBLEM_STATUS.TODO,
      comment: "",
    },
    {
      problemName: {
        required: 'Problem name is required',
        custom: (value) => {
          if (value.length > 200) {
            return 'Problem name must be less than 200 characters';
          }
          return null;
        },
      },
      link: {
        required: 'LeetCode link is required',
        custom: (value) => {
          if (!validation.url(value)) {
            return 'Please enter a valid URL';
          }
          return null;
        },
      },
      comment: {
        custom: (value) => {
          if (value && value.length > 500) {
            return 'Comment must be less than 500 characters';
          }
          return null;
        },
      },
    }
  );

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await apiService.createProblem(formData);
      dispatch(addProblem(response));
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create problem';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="problem-form">
      <h2>Add New Problem</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="problem-form-content">
        <div className="form-group">
          <label htmlFor="problemName">Problem Name</label>
          <input
            type="text"
            id="problemName"
            name="problemName"
            placeholder="Enter problem name"
            value={values.problemName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.problemName && touched.problemName ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.problemName && touched.problemName && (
            <span className="field-error">{errors.problemName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="link">LeetCode Link</label>
          <input
            type="url"
            id="link"
            name="link"
            placeholder="https://leetcode.com/problems/..."
            value={values.link}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.link && touched.link ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.link && touched.link && (
            <span className="field-error">{errors.link}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="level">Difficulty Level</label>
          <select
            id="level"
            name="level"
            value={values.level}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          >
            <option value={PROBLEM_LEVEL.EASY}>Easy</option>
            <option value={PROBLEM_LEVEL.MEDIUM}>Medium</option>
            <option value={PROBLEM_LEVEL.HARD}>Hard</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          >
            <option value={PROBLEM_STATUS.TODO}>To Do</option>
            <option value={PROBLEM_STATUS.DOING}>In Progress</option>
            <option value={PROBLEM_STATUS.DONE}>Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment (Optional)</label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Add any notes or comments..."
            value={values.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.comment && touched.comment ? 'error' : ''}
            rows="3"
            disabled={isSubmitting}
          />
          {errors.comment && touched.comment && (
            <span className="field-error">{errors.comment}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Problem'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProblemForm;