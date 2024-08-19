import {Component} from 'react'

import {BsSearch} from 'react-icons/bs'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import JobCard from '../JobCard'

import Header from '../Header'

import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileData: [],
    profileStatus: profileStatusConstants.initial,
    activeCheckBoxList: [],
    activeSalaryRange: '',
    inputValue: '',
    jobsStatus: profileStatusConstants.initial,
    jobItemsList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobs()
  }

  getProfileData = async () => {
    this.setState({profileStatus: profileStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedDetails,
        profileStatus: profileStatusConstants.success,
      })
    } else {
      this.setState({profileStatus: profileStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsStatus: profileStatusConstants.inProgress})
    const {activeCheckBoxList, activeSalaryRange, inputValue} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${activeCheckBoxList.join()}&minimum_package=${activeSalaryRange}&search=${inputValue}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobItemsList: updatedData,
        jobsStatus: profileStatusConstants.success,
      })
    } else {
      this.setState({jobsStatus: profileStatusConstants.failure})
    }
  }

  getProfileDetails = () => {
    const {profileData} = this.state

    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="heading-profile">{name}</h1>
        <p className="description-profile">{shortBio}</p>
      </div>
    )
  }

  profileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobsLoader = () => (
    <div className="jobs-loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileFailure = () => (
    <div className="profile-failure-container">
      <h1 className="failure-profile-heading">Profile Fail</h1>
      <button
        className="profile-retry-button"
        onClick={this.getProfileData}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case profileStatusConstants.inProgress:
        return this.profileLoader()
      case profileStatusConstants.success:
        return this.getProfileDetails()
      case profileStatusConstants.failure:
        return this.profileFailure()
      default:
        return null
    }
  }

  renderJobCardsView = () => {
    const {jobsStatus} = this.state

    switch (jobsStatus) {
      case profileStatusConstants.inProgress:
        return this.jobsLoader()
      case profileStatusConstants.success:
        return this.renderJobCards()
      case profileStatusConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  onclickRetryButton = () => this.getJobs()

  renderJobFailureView = () => (
    <div className="job-failure-view">
      <div className="image-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="job-failure-image"
          alt="failure view"
        />
      </div>
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <div className="button-container">
        <button
          type="button"
          onClick={this.onclickRetryButton}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobCards = () => {
    const {jobItemsList} = this.state
    return jobItemsList.length > 0 ? (
      <ul className="jobs-container">
        {jobItemsList.map(eachItem => (
          <JobCard key={eachItem.id} jobDetails={eachItem} />
        ))}
      </ul>
    ) : (
      this.noJobsView()
    )
  }

  onChangeActiveCheckBox = event => {
    const {value} = event.target
    const {activeCheckBoxList} = this.state

    if (activeCheckBoxList.includes(value)) {
      const updatedList = activeCheckBoxList.filter(
        eachItem => eachItem !== value,
      )
      this.setState({activeCheckBoxList: updatedList}, this.getJobs)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [...prevState.activeCheckBoxList, value],
        }),
        this.getJobs,
      )
    }
  }

  renderEmployementType = () => (
    <div className="type-of-employment-container">
      <h1 className="heading-checkbox">Type of Employment</h1>
      <ul className="checkbox-items">
        {employmentTypesList.map(eachItem => (
          <li className="list-item" key={eachItem.employmentTypeId}>
            <input
              type="checkbox"
              className="input-checkbox"
              id={eachItem.employmentTypeId}
              value={eachItem.employmentTypeId}
              onChange={this.onChangeActiveCheckBox}
            />
            <label
              htmlFor={eachItem.employmentTypeId}
              className="checkbox-heading"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeActiveSalary = event => {
    this.setState({activeSalaryRange: event.target.value}, this.getJobs)
  }

  renderSalaryRange = () => (
    <div className="type-of-employment-container">
      <h1 className="heading-checkbox ">Salary Range</h1>
      <ul className="salary-range-list-items-container">
        {salaryRangesList.map(eachItem => (
          <li className="list-item" key={eachItem.salaryRangeId}>
            <input
              type="radio"
              id={eachItem.salaryRangeId}
              className="input-checkbox"
              value={eachItem.salaryRangeId}
              name="option"
              onChange={this.onChangeActiveSalary}
            />
            <label
              htmlFor={eachItem.salaryRangeId}
              className="checkbox-heading"
            >
              {eachItem.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeInput = event => {
    this.setState({inputValue: event.target.value})
  }

  noJobsView = () => (
    <div className="no-jobs-view">
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
      </div>
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onKeyDownInput = event => {
    const {jobItemsList} = this.state
    if (event.key === 'Enter') {
      if (jobItemsList.length > 0) {
        this.getJobs()
      }
    }
  }

  onClickSearchInputButton = () => {
    this.getJobs()
  }

  render() {
    const {inputValue} = this.state

    return (
      <div>
        <Header />
        <div className="jobs-lg-responsive-container">
          <div className="apply-filters-container">
            {this.renderProfileView()}
            <hr className="horizantal-line" />
            {this.renderEmployementType()}
            <hr className="horizantal-line" />
            {this.renderSalaryRange()}
          </div>
          <div className="job-item-description-container">
            <div className="search-item-container">
              <input
                type="search"
                placeholder="Search"
                className="input-element"
                onChange={this.onChangeInput}
                value={inputValue}
                onKeyDown={this.onKeyDownInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                onClick={this.onClickSearchInputButton}
                className="button-search-input"
              >
                <BsSearch className="search-button" />
              </button>
            </div>
            <br />
            <div className="job-cards-container">
              {this.renderJobCardsView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs