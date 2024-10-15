import React, { useState } from "react";
import { useJobs } from "../../context/JobsContext";
import { EditJob, ConfirmModal, CustomToast } from "../index";
import { Container, Button } from "react-bootstrap";

const JobsList = ({ jobs, user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [currentJob, setCurrentJob] = useState(null);
  const { deleteJob } = useJobs();
  const userId = user ? user.id : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página

  // Calcular los índices de inicio y fin
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(jobs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (job) => {
    setCurrentJob(job); // Establecer el trabajo actual
    setShowEditModal(true); // Mostrar el modal de edición
  };

  const handleDelete = (jobId) => {
    setCurrentJob({ id: jobId }); // Establecer el trabajo actual con solo su ID
    setShowDeleteConfirm(true); // Mostrar el modal de confirmación de eliminación
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteJob(currentJob);
      if (res && res.message) {
        setToastColor("green");
        setToastMessage(res.message);
        setShowToast(true);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      setToastMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
      setToastColor("red");
      setShowToast(true);
    }
  };

  return ( 
    <Container>
      <h1>List</h1>
      <section>
        {!jobs.length ? (
          <p>No jobs available</p>
        ) : (
          currentItems.map((job) => (
            <div key={job.id} className="p-2">
              <h4>{job.title}</h4>
              <div>
                <strong>Company:</strong> {job.company}
              </div>
              <div>
                <strong>Location:</strong> {job.location}
              </div>
              <div>
                <strong>Salary:</strong> {job.salary}
              </div>
              <details>
                <summary>Details</summary>
                <p>{job.description}</p>
              </details>
              {job.id_user === userId && (
                <div className="m-1">
                  <Button variant="primary" onClick={() => handleEdit(job)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(job.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </section>
      <section>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(jobs.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </section>
      {showEditModal && (
        <EditJob
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          job={currentJob}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this job?"
        />
      )}
      {showToast && (
        <CustomToast
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
          color={toastColor}
        />
      )}
    </Container>
  );
};

export default JobsList;
