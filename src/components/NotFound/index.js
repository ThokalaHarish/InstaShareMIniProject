import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/ths-company/image/upload/v1680710805/Group_3_urhokq.png"
      alt="NotFound"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found.
    </p>
    <p className="not-found-description">Please go back to the homepage.</p>
    <Link to="/">
      <button className="button" type="button">
        Home Page
      </button>
    </Link>
  </div>
)
export default NotFound
