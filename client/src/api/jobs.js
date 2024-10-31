import axios from './axios';


export const createJobRequest = async (job) => {
    const res = await axios.post(`/createJob`, job);
    return res.data;
}

export const getAllJobsRequest = async () => {
    const res = await axios.get(`/allJobs`);
    return res.data;
}

export const updateJobRequest = async (job) => {
    const res = await axios.put(`/updateJob`, job);
    return res.data;
}

export const deleteJobRequest = async (jobId) => {
    const res = await axios.delete(`/deleteJob`, { data: { id: jobId } }); 
    return res.data;
};

