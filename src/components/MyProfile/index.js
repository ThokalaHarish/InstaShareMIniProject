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

class MyProfile extends Component {
  state = {
    myProfile: {},
    postList: [],
    storyList: [],
    searchPostList: [],
    profileStatus: status.initial,
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
    this.setState({profileStatus: status.initial})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const {profile} = data
      // console.log(data)
      const updatedMyProfileDetails = {
        id: profile.id,
        userId: profile.user_id,
        userName: profile.user_name,
        profilePic: profile.profile_pic,
        followingCount: profile.following_count,
        userBio: profile.user_bio,
        followersCount: profile.followers_count,
        postsCount: profile.posts_count,
        stories: profile.stories,
      }
      const updatedStoryList = profile.stories
      const updatedPostList = profile.posts
      this.setState({
        profileStatus: status.success,
        myProfile: updatedMyProfileDetails,
        postList: updatedPostList,
        storyList: updatedStoryList,
      })
    } else {
      this.setState({profileStatus: status.failed})
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
        <img src={profilePic} alt="my profile" className="profile-pics" />
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
            <img src={each.image} alt="my story" className="user-story" />
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="profile-loader-container">
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
              <UserPostItem key={each.id} postItem={each} route="my" />
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

  renderMyProfile = () => (
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
    const {profileStatus} = this.state
    let profileMode

    switch (profileStatus) {
      case status.initial:
        profileMode = this.renderLoadingView()
        break
      case status.success:
        profileMode = this.renderMyProfile()
        break
      case status.failed:
        profileMode = this.renderFailedView()
        break
      default:
        break
    }
    return profileMode
  }

  getSearchPost = async () => {
    this.setStatus({searchStatus: status.initial, isSearched: true})
    const {caption} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${caption}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (data.post.length > 0) {
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
          selectedRoute={isSearched === false ? 'my-Profile' : undefined}
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
export default MyProfile
