import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = props => {
  const onClickFind = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-responsive-container">
        <div className="text-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-paragraph">
            Millions of people are searching for jobs,salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>

          <Link className="link-item" to="/jobs">
            <button
              type="button"
              onClick={onClickFind}
              className="find-jobs-button"
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home
