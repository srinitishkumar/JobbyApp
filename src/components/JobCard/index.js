import {MdLocationOn} from 'react-icons/md'

import {AiFillStar} from 'react-icons/ai'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="link-element" key={id}>
        <div className="job-card-element">
          <div className="company-logo-name-container">
            <div className="image-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
            </div>
            <div className="company-name-rating-container">
              <h1 className="heading-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="rating-image" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-package-container">
            <div className="location-type-container">
              <div className="location-container">
                <MdLocationOn className="location-element" />
                <p className="location-type-text">{location}</p>
              </div>
              <div className="location-container">
                <BsFillBriefcaseFill className="briefcase-job-element" />
                <p className="location-type-text">{employmentType}</p>
              </div>
            </div>
            <div className="package-container">
              <h1 className="package-element">{packagePerAnnum}</h1>
            </div>
          </div>
          <hr className="hr-line" />
          <h1 className="description-heading">Description</h1>
          <p className="description-element">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobCard
