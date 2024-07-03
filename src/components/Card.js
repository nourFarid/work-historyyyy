import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAuthUser } from '../helper/Storage';

const Card = ({ id, onDelete }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuthUser(); // Assuming getAuthUser returns the user object synchronously

  useEffect(() => {
    fetchProjects();
  }, []); // Empty dependency array ensures useEffect runs only once

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/project/getAllProjects/${auth._id}`);
      if (response.status === 200) {
        setProjects(response.data.data.projects);
      }
    } catch (error) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/project/deleteProjectById/${id}`);
      setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
    } catch (error) {
      setError('Error deleting project');
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="row"
    style={{width:"1500px"}}>
      {projects.map(project => (
        <div key={project._id} className="col-md-4 mb-4">
          <div className="card h-100">
            <img 
              src={project.picture ? `http://localhost:4000/${project.picture}` : "https://via.placeholder.com/150"} 
              className="card-img-top" 
              alt={project.projectName} 
            />
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title text-center mb-3">{project.projectName}</h5>
              <div className="text-center mt-auto">
                <Link to={`/card/${project._id}`} className="btn btn-primary me-2">View Details</Link>
                <button 
                  style={{ marginTop: "5px" }}
                  onClick={() => handleDelete(project._id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
