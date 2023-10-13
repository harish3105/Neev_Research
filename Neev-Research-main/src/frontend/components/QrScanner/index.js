import {Component} from 'react'
import QrReader from 'react-qr-scanner'
import {AiOutlineScan} from 'react-icons/ai'

import './index.css'

class QrScanner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: undefined,
      progress: 'IN_PROGRESS',
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan = data => {
    if (data === null) {
      this.setState({
        result: data,
        progress: 'SCANNING',
      })
    } else {
      this.setState({result: data, progress: 'SUCCESS'})
    }
  }

  handleError = err => {
    this.setState({progress: 'FAILURE', result: err})
  }

  onSaveToDatabase = async () => {
    this.setState({progress: 'LOADING'})
    const {result} = this.state
    const url = '/api/store-candidate/'
    const options = {
      method: 'POST',
      Authorization: 'Bearer Token',
      body: JSON.stringify(result),
    }
    try {
      const response = await fetch(url, options)
      console.log(response)
      if (response.ok) {
        this.setState({progress: 'POST-SUCCESS'})
      } else {
        this.setState({progress: 'FAILURE'})
      }
    } catch (e) {
      console.log(e)
    }
  }

  onClickScan = () => {
    this.setState({progress: 'SCANNING'})
  }

  onRestart = () => {
    this.setState({progress: 'IN_PROGRESS'})
  }

  qrScanner = () => {
    const previewStyle = {
      height: 240,
      width: 320,
    }

    const {delay} = this.state

    return (
      <div>
        {this.renderHeader()}
        <div className="background">
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
          />
        </div>
      </div>
    )
  }

  renderHeader = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <a className="navbar-brand" href="#home">
        <img
          src="https://res-console.cloudinary.com/dijyby6dt/thumbnails/transform/v1/image/upload/Yl9hdXRvOnByZWRvbWluYW50LGNfcGFkLGhfMzAwLHdfMzAwLGZfanBnLGZsX2xvc3N5LmFueV9mb3JtYXQucHJlc2VydmVfdHJhbnNwYXJlbmN5LnByb2dyZXNzaXZl/v1/aXZtMDNrMnJ1YzE5eWJybjZkbHA=/template_primary"
          alt="company logo"
          className="logo"
        />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-link active" href="#home">
            Home
            <span className="sr-only">(current)</span>
          </a>
          <a className="nav-link" href="#about">
            About
          </a>
          <a className="nav-link" href="#contact">
            Contact
          </a>
        </div>
      </div>
    </nav>
  )

  renderSuccessView = () => {
    const {result} = this.state
    const name = result.name === undefined ? 'NAME' : result.name
    const dateOfBirth =
      result.date_of_birth === undefined ? '1-1-2000' : result.date_of_birth
    const address = result.address === undefined ? 'Address' : result.address
    const contactDetails =
      result.contact_details === undefined
        ? 'Contact Details'
        : result.contact_details
    const gender = result.gender === undefined ? 'MALE' : result.gender
    return (
      <>
        {this.renderHeader()}
        <div className="background">
          <h1 className="head">Your Details</h1>
          <p className="para">Your Name : {name}</p>
          <p className="para">DOB : {dateOfBirth}</p>
          <p className="para">Address : {address}</p>
          <p className="para">Contact Details : {contactDetails}</p>
          <p className="para">Gender : {gender}</p>
          <button
            type="button"
            onClick={this.onSaveToDatabase}
            className="button"
          >
            Save
          </button>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      {this.renderHeader()}
      <div className="background">
        <img
          src="https://res-console.cloudinary.com/dijyby6dt/thumbnails/transform/v1/image/upload/Yl9hdXRvOnByZWRvbWluYW50LGNfcGFkLGhfMzAwLHdfMzAwLGZfanBnLGZsX2xvc3N5LmFueV9mb3JtYXQucHJlc2VydmVfdHJhbnNwYXJlbmN5LnByb2dyZXNzaXZl/v1/ZXJyb3JpbmdfMl9leTZlaGM=/template_primary"
          alt="error"
          className="failure-image"
        />
        <h1 className="head">Some thing went wrong! Please try again</h1>
        <button type="button" className="button" onClick={this.onRestart}>
          Retry
        </button>
      </div>
    </>
  )

  renderLoading = () => (
    <div className="background">
      <p className="para">Loading Please wait...</p>
    </div>
  )

  onStart = () => (
    <div>
      {this.renderHeader()}
      <div className="background">
        <AiOutlineScan className="scanner" />
        <h1 className="head">Scan to get Started</h1>
        <p className="para">
          To get Started you have to scan the QR code to get your information
        </p>
        <button type="button" className="button" onClick={this.onClickScan}>
          Scan Here
        </button>
      </div>
    </div>
  )

  renderPostSuccess = () => (
    <>
      {this.renderHeader()}
      <div className="background">
        <h1 className="head">Your Details were saved to database you.</h1>
        <button type="button" className="button">
          Get Started
        </button>
      </div>
    </>
  )

  render() {
    const {progress} = this.state

    switch (progress) {
      case 'IN_PROGRESS':
        return this.onStart()
      case 'SCANNING':
        return this.qrScanner()
      case 'POST-SUCCESS':
        return this.renderPostSuccess()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      case 'LOADING':
        return this.renderLoading()
      default:
        return this.renderFailureView()
    }
  }
}

export default QrScanner
