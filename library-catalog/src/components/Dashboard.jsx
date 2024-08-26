import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      <div className="button-container">
        <Link to="/catalog">
          <button className="dashboard-button">Catalog</button>
        </Link>
        <Link to="/employees">
          <button className="dashboard-button">Employees</button>
        </Link>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Dashboard;
