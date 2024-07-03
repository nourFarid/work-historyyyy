import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthUser, removeAuthUser } from '../helper/Storage';
const auth = getAuthUser(); // Assuming getAuthUser returns the user object synchronously

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

const NewCard = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  // const [createdBy, setCreatedBy] = useState('');
  const [checkedBy, setCheckedBy] = useState('');
  const [designedBy, setDesignedBy] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('in progress'); // Default status value
  const [updates, setUpdates] = useState([]);
  const [updatesText, setUpdatesText] = useState('');
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('projectName', name);
    formData.append('client', client);
    formData.append('createdBy', auth._id);
    formData.append('checkedBy', checkedBy);
    formData.append('designedBy', designedBy);
    formData.append('location', location);
    formData.append('status', status);
    formData.append('updates', JSON.stringify(updates));
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await axios.post('http://localhost:4000/project/createProject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        const createdProject = response.data.data.newProject;
        onAdd(createdProject);
        navigate('/main');
      } else {
        alert('Failed to create project.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project.');
    }
  };

  const handleUpdatesChange = (e) => {
    const value = e.target.value;
    setUpdatesText(value);
    try {
      const parsedUpdates = JSON.parse(value);
      setUpdates(parsedUpdates);
    } catch (error) {
      console.error('Error parsing updates:', error);
    }
  };

  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <div className="container">
      <h2 className="my-4">New Project</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="client" className="form-label">Client</label>
          <input
            type="text"
            className="form-control"
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="checkedBy" className="form-label">Checked By</label>
          <input
            type="text"
            className="form-control"
            id="checkedBy"
            value={checkedBy}
            onChange={(e) => setCheckedBy(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="designedBy" className="form-label">Designed By</label>
          <input
            type="text"
            className="form-control"
            id="designedBy"
            value={designedBy}
            onChange={(e) => setDesignedBy(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <select
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select Location</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="in progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="working on comments">Working on Comments</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="updates" className="form-label">Updates (Optional)</label>
          <textarea
            className="form-control"
            id="updates"
            value={updatesText}
            onChange={handleUpdatesChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Picture (Optional)</label>
          <input
            type="file"
            className="form-control"
            id="picture"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
    </div>
  );
};

export default NewCard;
