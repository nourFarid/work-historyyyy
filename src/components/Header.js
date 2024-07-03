import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthUser, removeAuthUser } from '../helper/Storage';

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuthUser(); // Assuming getAuthUser returns the user object synchronously

  const logout = () => {
    removeAuthUser();
    navigate('/');
    // window.location.reload()
  };

  return (
    <header className="bg-primary text-white text-center py-2"> {/* Reduced py-3 to py-2 */}
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Project History!</h1> {/* Adjusted font size */}
          <p>Salute, {auth.username}</p> {/* Assuming auth.username is available synchronously */}
        </div>
        <div className="d-flex align-items-center">
          <Link to="/new-card" className="btn btn-light me-2">New Project</Link> {/* Added margin to the right */}
          <button
            className="btn btn-danger"
            style={{ marginLeft: '10px' }} // Added inline style for left margin
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
