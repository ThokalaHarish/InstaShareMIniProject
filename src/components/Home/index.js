import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

import Header from '../Header'
import PostItemDetails from '../PostItemDetails'
import ReactSlick from '../ReactSlick'

const apiStatus = {
  initial: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Home extends Component {
  state = {
    userPostArray: [],
    userStoryArray: [],
    caption: '',
    searchPostList: [],
    storyStatus: apiStatus.initial,
    postStatus: apiStatus.initial,
    searchStatus: apiStatus.initial,
    isSearched: false,
  }

  componentDidMount() {
    this.getInstaSharePosts()
    this.getInstaShareStories()
  }

  checkCaption = () => {
    const {caption} = this.state
    if (caption.length === 0) {
      this.setSate({isSearched: false})
    }
  }

  onChangeSearchStatus = value => {
    if (value === '') {
      this.setState({isSearched: false})
    }
  }

  getInstaShareStories = async () => {
    this.setState({storyStatus: apiStatus.initial})
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedStoryStatus = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))
      this.setState({
        storyStatus: apiStatus.success,
        userStoryArray: updatedStoryStatus,
      })
    } else {
      this.setState({storyStatus: apiStatus.failed})
    }
  }

  getInstaSharePosts = async () => {
    this.setState({postStatus: apiStatus.initial})
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedPostDetails = data.posts.map(each => ({
        postId: each.post_id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        postDetails: {
          imageUrl: each.post_details.image_url,
          caption: each.post_details.caption,
        },
        likesCount: each.likes_count,
        comments: each.comments.map(eachItem => ({
          userName: eachItem.user_name,
          userId: eachItem.use_id,
          comment: eachItem.comment,
        })),
        createdAt: each.created_at,
      }))
      this.setState({
        postStatus: apiStatus.success,
        userPostArray: updatedPostDetails,
      })
    } else {
      this.setState({postStatus: apiStatus.failed})
    }
  }

  getSearchPost = async () => {
    this.setState({searchStatus: apiStatus.initial, isSearched: true})
    const {caption} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${caption}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedUserPostDetails = data.posts.map(each => ({
        postId: each.user_id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        postDetails: {
          imageUrl: each.post_details.image_url,
          caption: each.post_details.caption,
        },
        likesCount: each.likes_count,
        comments: each.comments.map(eachItem => ({
          userName: eachItem.user_name,
          userId: eachItem.userId,
          comment: eachItem.comment,
        })),
        createdAt: each.created_at,
      }))
      this.setState({
        searchPostList: updatedUserPostDetails,
        searchStatus: apiStatus.success,
      })
      this.checkCaption()
    } else {
      this.setState({searchStatus: apiStatus.failed})
    }
  }

  onClickedSearchBar = searchCaption => {
    this.setState({caption: searchCaption}, this.getSearchPost)
  }

  renderLoading = () => {
    const {isSearched} = this.state

    return (
      <div
        className={
          isSearched ? 'loader-container post-section' : 'loader-container'
        }
        data-testid="loader"
      >
        <Loader type="TailSpin" color="#4094Ef" height={60} width={60} />
      </div>
    )
  }

  renderStoryViewLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="tailSpin" color="#4094Ef" height={60} width={60} />
    </div>
  )

  renderStoryView = () => {
    const {userStoryArray} = this.state

    return <ReactSlick userStoryArray={userStoryArray} />
  }

  renderPost = () => {
    const {userPostArray} = this.state

    return (
      <ul className="post-list-container">
        {userPostArray.map(eachItem => (
          <PostItemDetails postItem={eachItem} key={eachItem.postId} />
        ))}
      </ul>
    )
  }

  renderSearchCaption = () => {
    const {searchPostList} = this.state

    return (
      <>
        {searchPostList.length > 0 ? (
          <>
            <h1 className="search-heading">Search Results</h1>
            <div className="search-card-container">
              <ul className="post-list-container">
                {searchPostList.map(eachItem => (
                  <PostItemDetails postItem={eachItem} key={eachItem.postId} />
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="search-failure-container">
            <img
              src="https://res.cloudinary.com/ths-company/image/upload/v1680710712/Group_2_dzq9of.png"
              alt="search not found"
              className="search-failure-img"
            />
            <h1 className="search-failure-heading">Search Not Found</h1>
            <p className="search-failure-description">
              Try different Keyword or search again
            </p>
          </div>
        )}
      </>
    )
  }

  onClickedPostTryAgain = () => {
    this.getInstaSharePosts()
  }

  onClickedSearchTryAgain = () => {
    this.getSearchPost()
  }

  onClickedStoryTryAgain = () => {
    this.getInstaShareStories()
  }

  renderStoryFailureView = () => (
    <div className="home-failure-container">
      <img
        src="https://res.cloudinary.com/ths-company/image/upload/v1680710993/Icon_hyuqea.png"
        alt="failure view"
        className="home-failure-view-img"
      />
      <p className="home-error-msg">Something went wrong. please try again</p>
      <button
        type="button"
        className="home-failure-btn"
        onClick={this.onClickedStoryTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderSearchFailureView = () => (
    <div className="failure-bg">
      <div className="home-failure-container">
        <img
          src="https://res.cloudinary.com/ths-company/image/upload/v1680710897/Group_7522_ivpacm.png"
          alt="failure view"
          className="home-failure-view-img"
        />
        <p className="home-error-msg">Something went wrong. Please try again</p>
        <button
          type="button"
          className="home-failure-btn"
          onClick={this.onClickedSearchTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderPostFailureView = () => (
    <div className="home-failure-container">
      <img
        src="https://res.cloudinary.com/ths-company/image/upload/v1680710897/Group_7522_ivpacm.png"
        alt="failure view"
        className="home-failure-view-img"
      />
      <p className="home-error-msg">Something went wrong. Please try again</p>
      <button
        type="button"
        className="home-failure-btn"
        onClick={this.onClickedPostTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderStoryViewSection = () => {
    this.renderPostSection()
    const {storyStatus} = this.state
    let storyMode

    switch (storyStatus) {
      case apiStatus.initial:
        storyMode = this.renderStoryViewLoading()
        break
      case apiStatus.success:
        storyMode = this.renderStoryView()
        break
      case apiStatus.failed:
        storyMode = this.renderStoryFailureView()
        break
      default:
        break
    }
    return storyMode
  }

  renderPostSection = () => {
    const {postStatus} = this.state
    let postMode

    switch (postStatus) {
      case apiStatus.initial:
        postMode = this.renderLoading()
        break
      case apiStatus.success:
        postMode = this.renderPost()
        break
      case apiStatus.failed:
        postMode = this.renderPostFailureView()
        break
      default:
        break
    }
    return postMode
  }

  renderSearchSection = () => {
    const {searchStatus} = this.state
    let searchMode

    switch (searchStatus) {
      case apiStatus.initial:
        searchMode = this.renderLoading()
        break
      case apiStatus.success:
        searchMode = this.renderSearchCaption()
        break
      case apiStatus.failed:
        searchMode = this.renderSearchFailureView()
        break
      default:
        break
    }
    return searchMode
  }

  render() {
    const {searchCaption, isSearched} = this.state

    return (
      <div className="home-page-container">
        <Header
          searchCaption={searchCaption}
          onClickedSearchBar={this.onClickedSearchBar}
          onChangeSearchStatus={this.onChangeSearchStatus}
          selectedRoute={isSearched === false ? 'Home' : undefined}
        />
        <div className="home-post-container">
          <div className="home-content-container">
            {isSearched === false ? this.renderStoryViewSection() : null}
            {isSearched === false ? (
              <div className="post-section">{this.renderPostSection()}</div>
            ) : (
              this.renderSearchSection()
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
