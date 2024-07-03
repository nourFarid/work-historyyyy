import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
  'Cameroon', 'Canada', 'Central African Republic (CAR)', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Democratic Republic of the Congo', 
  'Republic of the Congo', 'Costa Rica', 'Cote d Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 
  'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 
  'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 
  'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'UK', 'USA', 
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const CardDetails = ({ onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    checkedBy: '',
    designedBy: '',
    location: '',
    status: ''
  });
  const [newUpdate, setNewUpdate] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/project/getProjectById/${id}`);
        if (response.status === 200) {
          const { project } = response.data.data;
          setProject(project);
          setFormData({
            projectName: project.projectName,
            client: project.client,
            checkedBy: project.checkedBy.join(', '),
            designedBy: project.designedBy.join(', '),
            location: project.location,
            status: project.status
          });
          // setSelectedCheckboxes(project.submittionPackage);
        }
      } catch (error) {
        setError('Failed to fetch project details');
      }
    };

    fetchProjectById();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedCheckboxes([...selectedCheckboxes, value]);
    } else {
      setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== value));
    }
  };

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/project/updateProjectById/${id}`, {
        updates: [{ update: newUpdate, updateDate: new Date() }]
      });

      if (response.status === 200) {
        const updatedProject = response.data.data.updatedProject;
        onUpdate(id, updatedProject); // Update local state with the updated project
        setNewUpdate('');
        window.location.reload(); // Clear the new update input field
      } else {
        setError('Failed to add update');
      }
    } catch (error) {
      setError('Failed to add update');
    }
  };

  const handleCheckboxSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/project/updateSubmittionPackageById/${id}`, {
        updates: selectedCheckboxes.join(', ')
      });

      if (response.status === 200) {
        const updatedProject = response.data.data.updatedProject;
        onUpdate(id, updatedProject); // Update local state with the updated project
        window.location.reload(); // Reload the page
      } else {
        setError('Failed to update submission package');
      }
    } catch (error) {
      setError('Failed to update submission package');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProjectData = {
        projectName: formData.projectName,
        client: formData.client,
        checkedBy: formData.checkedBy.split(',').map(item => item.trim()),
        designedBy: formData.designedBy.split(',').map(item => item.trim()),
        location: formData.location,
        status: formData.status
      };

      const response = await axios.put(`http://localhost:4000/project/updateProjectGeneralById/${id}`, updatedProjectData);
      if (response.status === 200) {
        const updatedProject = response.data.data.updatedProject;
        onUpdate(id, updatedProject); // Update local state with the updated project
        window.location.reload(); // Reload the page
      } else {
        setError('Failed to update project');
      }
    } catch (error) {
      setError('Failed to update project');
    }
  };

  if (!project) {
    return <p>Loading...</p>; // Add loading state while fetching data
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}> {/* Adjusted maxWidth to make the container smaller */}
      <div className="card mt-4">
        <img src={project.picture ? `http://localhost:4000/${project.picture}` : 'https://via.placeholder.com/150'} className="card-img-top"
          alt={project.projectName}
          style={{
            maxWidth: '100%', // Set maximum width of the image
            maxHeight: '400px', // Set maximum height of the image
            width: 'auto', // Allow the width to adjust based on maxWidth and maintain aspect ratio
            height: 'auto', // Allow the height to adjust based on maxHeight and maintain aspect ratio
            objectFit: 'contain' // Fit the entire image inside the container without cropping
          }}
        />
        <div className="card-body">
          <h5 className="card-title">{project.projectName}</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="client" className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="designedBy" className="form-label">Designed By</label>
              <input
                type="text"
                className="form-control"
                id="designedBy"
                name="designedBy"
                value={formData.designedBy}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="checkedBy" className="form-label">Checked By</label>
              <input
                type="text"
                className="form-control"
                id="checkedBy"
                name="checkedBy"
                value={formData.checkedBy}
                onChange={handleInputChange}
                required
              />
            </div>
   
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <select
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-control"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="in progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Update Project</button>
          </form>
          <hr />
          <h6>Updates:</h6>
          <ul>
            {project.updates.map(update => (
              <li key={update._id}>{new Date(update.updateDate).toLocaleString()}: {update.update}</li>
            ))}
          </ul>
          <hr />
          
          <form onSubmit={handleAddUpdate}>
            <div className="mb-3">
              <label htmlFor="newUpdate" className="form-label">New Update</label>
              <input
                type="text"
                className="form-control"
                id="newUpdate"
                name="newUpdate"
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">Add Update</button>
          </form>
          <hr />
          <h6>Submittion Package:</h6>
          <ul>
            {project.submittionPackage.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h6>Select Options to Add to Submission Package:</h6>
          {['AutoCad', 'SAFE 2016', 'SAFE 2020','SAFE 2021','ETABS V19.1','ETABS V20.3','ETABS V21.2','SAP V22','SAP V24','REVIT 2021','REVIT 2022','NAVISWORK 2021','NAVISWORK 2022','DYNAMO','ROBOT 2021','ROBOT 2022','RESPONSE','PHOTOSHOP','WORD','EXCEL','POWERPOINT',].map(option => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input"
                type="checkbox"
                value={option}
                id={option}
                checked={selectedCheckboxes.includes(option)}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={option}>
                {option}
              </label>
            </div>
          ))}
          <form onSubmit={handleCheckboxSubmit}>
            <button type="submit" className="btn btn-warning mt-3">Submit Selected</button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
