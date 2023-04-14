import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {BiShareAlt} from 'react-icons/bi'
import {FaRegComment} from 'react-icons/fa'

import './index.css'

class PostItemDetails extends Component {
  state = {
    likeStatus: '',
    isLiked: false,
    isTrue: true,
    isFalse: false,
  }

  onClickLikedBtn = async () => {
    const {isLiked} = this.state
    const {postItem} = this.props
    const {postId} = postItem
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jsonData = {like_status: !isLiked}

    const options = {
      method: 'POST',
      headers: {Authorization: `Bearer ${jwtToken}`},
      body: JSON.stringify(jsonData),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    this.setState({likeStatus: data.message, isLiked: jsonData.like_status})
  }

  render() {
    const {postItem} = this.props
    const {isLiked, likeStatus, isTrue, isFalse} = this.state
    const postLiked = likeStatus === 'Post has been liked' ? isTrue : isFalse

    const {
      userId,
      userName,
      profilePic,
      postDetails,
      likesCount,
      comments,
      createdAt,
    } = postItem

    const likeCount = isLiked ? likesCount + 1 : likesCount

    const {imageUrl, caption} = postDetails
    return (
      <li className="post-item-details-card">
        <Link to={`/users/${userId}`} className="post-link">
          <div className="userName-profile-card">
            <div className="profile-pic-card">
              <img
                src={profilePic}
                alt="post author profile"
                className="user-profile-img"
              />
            </div>

            <p className="user-name">{userName}</p>
          </div>
        </Link>
        <img src={imageUrl} alt="post" className="post-img" />
        <div className="like-comment-share-card">
          {postLiked ? (
            <button
              type="button"
              className="like-btn"
              data-testid="unLikeIcon"
              onClick={this.onClickLikedBtn}
            >
              <FcLike className="unLike icon" />
            </button>
          ) : (
            <button
              type="button"
              className="like btn"
              data-testid="likeIcon"
              onClick={this.onClickLikedBtn}
            >
              <BsHeart className="unlike icon" />
            </button>
          )}
          <button className="like-btn" type="button" data-testid="commentIcon">
            <FaRegComment className="comment icon" />
          </button>
          <button className="like-btn" type="button" data-testid="shareIcon">
            <BiShareAlt className="share icon" />
          </button>
        </div>
        <p className="like-count-card">{`${likeCount}likes`}</p>
        <p className="caption">{caption}</p>
        <ul className="comment-list-container">
          {comments.map(eachItem => (
            <li className="comment-item" key={eachItem.userID}>
              <p className="comment">
                <span className="comment-userName">{eachItem.userName}</span>
                {eachItem.comment}
              </p>
            </li>
          ))}
        </ul>
        <p className="post-duration">{createdAt}</p>
      </li>
    )
  }
}
export default PostItemDetails
