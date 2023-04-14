import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import './index.css'

import Header from '../Header'
import UserPostItem from '../UserPostItem'
import PostItemDetails from '../PostItemDetails'

const status = {
  initial: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class UserProfile extends Component {
  state = {
    myProfile: {},
    postList: [],
    storyList: [],
    searchPostList: [],
    userProfileStatus: status.initial,
    caption: '',
    searchStatus: status.initial,
    isSearched: false,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  checkCaption = () => {
    const {caption} = this.state
    if (caption.length === 0) {
      this.setState({isSearched: false})
    }
  }

  getProfileDetails = async () => {
    this.setState({userProfileStatus: status.initial})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedUserProfileDetails = {
        id: data.user_details.id,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
        profilePic: data.user_details.profile_pic,
        followingCount: data.user_details.following_count,
        userBio: data.user_details.user_bio,
        followersCount: data.user_details.followers_count,
        postsCount: data.user_details.posts_count,
        stories: data.user_details.stories,
      }
      const updatedStoryList = data.user_details.stories
      const updatedPostList = data.user_details.posts
      this.setState({
        userProfileStatus: status.success,
        myProfile: updatedUserProfileDetails,
        postList: updatedPostList,
        storyList: updatedStoryList,
      })
    } else {
      this.setState({userProfileStatus: status.failed})
    }
  }

  renderProfileDetails = () => {
    const {myProfile} = this.state
    const {
      userId,
      userName,
      profilePic,
      followingCount,
      followersCount,
      userBio,
      postsCount,
    } = myProfile

    return (
      <div className="profile-details-container">
        <img src={profilePic} alt="user profile" className="user-profile-pic" />
        <div className="profile-details-card">
          <h1 className="profile-user-name">{userName}</h1>
          <div className="user-count-card">
            <p className="user-count-details">
              <span className="count">{postsCount}</span> Posts
            </p>
            <p className="user-count-details">
              <span className="count">{followersCount}</span> followers
            </p>
            <p className="user-count-details">
              <span className="count">{followingCount}</span> following
            </p>
          </div>
          <p className="user-name-bio">{userId}</p>
          <p className="user-bio">{userBio}</p>
        </div>
      </div>
    )
  }

  renderStoryDetails = () => {
    const {storyList} = this.state

    return (
      <ul className="user-story-container">
        {storyList.map(each => (
          <li key={each.id} className="user-story-card">
            <img src={each.image} alt="user story" className="user-story" />
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="tailSpin" color="#4094Ef" height={60} width={60} />
    </div>
  )

  renderPostItem = () => {
    const {postList} = this.state

    return (
      <>
        <div className="post-card">
          <BsGrid3X3 className="post-card-icon" />
          <h1 className="post-title">Posts</h1>
        </div>
        {postList.length > 0 ? (
          <ul className="post-item-container">
            {postList.map(each => (
              <UserPostItem key={each.id} postItem={each} route="user" />
            ))}
          </ul>
        ) : (
          <div className="no-post-container">
            <div className="no-post-card">
              <div className="no-post-icon">
                <BiCamera className="no-post-icon" />
              </div>
              <h1 className="no-post-msg">No Posts</h1>
            </div>
          </div>
        )}
      </>
    )
  }

  renderUserProfile = () => (
    <>
      {this.renderProfileDetails()}
      {this.renderStoryDetails()}
      <hr className="user-profile-line" />
      {this.renderPostItem()}
    </>
  )

  onClickedTryAgain = () => {
    this.getProfileDetails()
  }

  renderFailedView = () => (
    <div className="profile-failure-container">
      <div className="profile-failure-card">
        <img
          src="https://res.cloudinary.com/ths-company/image/upload/v1680710897/Group_7522_ivpacm.png"
          alt="failure view"
          className="profile-failure-view-img"
        />
        <p className="profile-failure-description">
          Something went wrong. Please try again
        </p>
        <button
          className="profile-failure-button"
          type="button"
          onClick={this.onClickedTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderProfileSection = () => {
    const {userProfileStatus} = this.state
    let userProfileMode

    switch (userProfileStatus) {
      case status.initial:
        userProfileMode = this.renderLoadingView()
        break
      case status.success:
        userProfileMode = this.renderUserProfile()
        break
      case status.failed:
        userProfileMode = this.renderFailedView()
        break
      default:
        break
    }
    return userProfileMode
  }

  getSearchPost = async () => {
    this.setState({searchStatus: status.initial, isSearched: true})
    const {caption} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${caption}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (data.posts.length > 0) {
      const updatedUserPostDetails = data.posts.map(each => ({
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
          userId: eachItem.user_id,
          comment: eachItem.comment,
        })),
        createdAt: each.created_at,
      }))
      this.setState({
        searchStatus: status.success,
        searchPostList: updatedUserPostDetails,
      })
      this.checkCaption()
    } else {
      this.setState({searchStatus: status.failed})
    }
  }

  onClickedSearchBar = searchCaption => {
    this.setState({caption: searchCaption}, this.getSearchPost)
  }

  onChangeSearchStatus = value => {
    if (value === '') {
      this.setState({isSearched: false})
    }
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
        <Loader type="TailSpin" width={60} height={60} color="#4094ef" />
      </div>
    )
  }

  renderSearchFailureView = () => (
    <div className="search-failure-container">
      <img
        src="https://res.cloudinary.com/ths-company/image/upload/v1680710712/Group_2_dzq9of.png"
        alt="search not found"
        className="search-failure-view-img"
      />
      <p className="search-failure-title">Search Not Found</p>
      <p className="search-failure-text">
        Try different keyword or search again
      </p>
    </div>
  )

  renderSearchCaption = () => {
    const {searchPostList} = this.state

    return (
      <>
        <h1 className="search-heading">Search Results</h1>
        <div className="search-card-container">
          <ul className="post-list-container">
            {searchPostList.map(eachItem => (
              <PostItemDetails key={eachItem.postId} postItem={eachItem} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderSearchSection = () => {
    const {searchStatus} = this.state
    let searchMode

    switch (searchStatus) {
      case status.initial:
        searchMode = this.renderLoading()
        break
      case status.success:
        searchMode = this.renderSearchCaption()
        break
      case status.failed:
        searchMode = this.renderSearchFailureView()
        break
      default:
        break
    }
    return searchMode
  }

  render() {
    const {isSearched} = this.state
    return (
      <div className="profilePage-container">
        <Header
          onClickedSearchBar={this.onClickedSearchBar}
          onChangeSearchStatus={this.onChangeSearchStatus}
        />
        <div className="profile-section-container">
          <div className="profile-content-container">
            {isSearched === false
              ? this.renderProfileSection()
              : this.renderSearchSection()}
          </div>
        </div>
      </div>
    )
  }
}
export default UserProfile
