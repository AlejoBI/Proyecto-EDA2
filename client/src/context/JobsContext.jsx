import { createContext, useState, useContext, useEffect } from "react";
import {
  createJobRequest,
  getAllJobsRequest,
  updateJobRequest,
  deleteJobRequest,
} from "../api/jobs";

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState(null);

  const createJob = async (job) => {
    try {
      const res = await createJobRequest(job);
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const getAllJobs = async () => {
    try {
      const res = await getAllJobsRequest();
      setJobs(res);
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const updateJob = async (job) => {
    try {
      const res = await updateJobRequest(job);
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const deleteJob = async (job) => {
    try {
      const res = await deleteJobRequest(job);
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  return (
    <JobsContext.Provider
      value={{ jobs, errors, createJob, updateJob, deleteJob, getAllJobs }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
