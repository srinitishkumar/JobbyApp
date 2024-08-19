import {Component} from 'react'

import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {BiLinkExternal} from 'react-icons/bi'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobCardItem extends Component {
  state = {
    jobCardStatus: apiStatusConstants.initial,
    jobDetailsList: {},
    similarJobData: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFormattedData = jobData => ({
    companyLogoUrl: jobData.company_logo_url,

    companyWebsiteUrl: jobData.company_website_url,

    employmentType: jobData.employment_type,
    id: jobData.id,
    jobDescription: jobData.job_description,
    lifeAtCompany: {
      description: jobData.life_at_company.description,
      imageUrl: jobData.life_at_company.image_url,
    },
    location: jobData.location,
    packagePerAnnum: jobData.package_per_annum,
    rating: jobData.rating,
    skills: jobData.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    title: jobData.title,
  })

  getFormattedSimilar = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobItemDetails = async () => {
    this.setState({jobCardStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const jobUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const similarJobs = data.similar_jobs.map(eachData =>
        this.getFormattedSimilar(eachData),
      )

      this.setState({
        jobCardStatus: apiStatusConstants.success,
        jobDetailsList: updatedData,
        similarJobData: similarJobs,
      })
    } else {
      this.setState({jobCardStatus: apiStatusConstants.failure})
    }
  }

  renderSkillItems = item => (
    <li className="skill-link" key={item.name}>
      <div className="skill-item-container">
        <img className="skill-image" alt={item.name} src={item.imageUrl} />
        <h1 className="skill-name-element">{item.name}</h1>
      </div>
    </li>
  )

  getJobCardDetails = () => {
    const {jobDetailsList} = this.state
    return (
      <>
        <div className="job-card-item-container">
          <div className="logo-heading-rating-container">
            <div>
              <img
                src={jobDetailsList.companyLogoUrl}
                alt="job details company logo"
                className="logo-element"
              />
            </div>
            <div className="heading-rating-container">
              <h1 className="card-heading">{jobDetailsList.title}</h1>
              <div className="rating-container">
                <div>
                  <AiFillStar className="star-image" />
                </div>
                <div>
                  <p className="star-label">{jobDetailsList.rating}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="location-type-salary-container">
            <div className="location-type-container">
              <div className="item-container">
                <MdLocationOn className="items-image" />
                <p className="label-element">{jobDetailsList.location}</p>
              </div>
              <div className="item-container">
                <BsFillBriefcaseFill className="items-image" />
                <p className="label-element">{jobDetailsList.employmentType}</p>
              </div>
            </div>
            <div className="salary-container">
              <p className="salary-header">{jobDetailsList.packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="description-visit-container">
            <div className="description-container">
              <h1 className="description-header">Description</h1>
            </div>
            <div className="visit-container">
              <a
                href={jobDetailsList.companyWebsiteUrl}
                className="visit-label"
              >
                Visit
              </a>

              <a
                href={jobDetailsList.companyWebsiteUrl}
                className="visit-label"
              >
                <BiLinkExternal className="visit-image" />
              </a>
            </div>
          </div>
          <p className="job-description">{jobDetailsList.jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {jobDetailsList.skills.map(skillItem =>
              this.renderSkillItems(skillItem),
            )}
          </ul>
          <h1 className="skills-heading">Life at Company</h1>
          <div className="lift-at-company-container">
            <div className="description-container">
              <p className="description-company">
                {jobDetailsList.lifeAtCompany.description}
              </p>
            </div>
            <div className="life-at-company-image-container">
              <img
                src={jobDetailsList.lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">{this.renderSimilarJobs()}</div>
      </>
    )
  }

  onClickRetryButton = () => this.getJobItemDetails()

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <div className="retry-button-container">
        <button
          type="button"
          onClick={this.onClickRetryButton}
          className="failure-retry-button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {jobCardStatus} = this.state
    switch (jobCardStatus) {
      case apiStatusConstants.success:
        return this.getJobCardDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  getSimilarItem = similarCard => (
    <li className="similar-link-item" key={similarCard.title}>
      <div className="similar-item-container">
        <div className="similar-logo-name-rating-container">
          <img
            src={similarCard.companyLogoUrl}
            alt="similar job company logo"
            className="similar-image-element"
          />
          <div className="position-rating-container">
            <h1 className="position-heading">{similarCard.title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-image" />
              <p className="similar-star-label">{similarCard.rating}</p>
            </div>
          </div>
        </div>
        <h1 className="similar-description-heading">Description</h1>
        <p className="similar-description">{similarCard.jobDescription}</p>
        <div className="bottom-logo-container">
          <div className="similar-locations-container">
            <MdLocationOn className="similar-bottom-images" />
            <p className="similar-label-element">{similarCard.location}</p>
          </div>
          <div className="similar-locations-container">
            <BsFillBriefcaseFill className="similar-bottom-images" />
            <p className="similar-label-element">
              {similarCard.employmentType}
            </p>
          </div>
        </div>
      </div>
    </li>
  )

  renderSimilarJobs = () => {
    const {similarJobData} = this.state

    return (
      <>
        <h1 className="similar-heading">Similar Jobs</h1>
        <br />

        <ul className="similar-jobs">
          {similarJobData.map(eachItem => this.getSimilarItem(eachItem))}
        </ul>
      </>
    )
  }

  render() {
    return (
      <div className="job-details-container">
        <Header />
        <div className="job-card-container">{this.renderJobDetails()}</div>
      </div>
    )
  }
}
export default JobCardItem