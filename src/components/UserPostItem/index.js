import './index.css'

const UserPostItem = props => {
  const {postItem, route} = props
  const {image} = postItem

  return (
    <li className="post-item-list">
      <img src={image} alt={`${route} post`} className="postItem" />
    </li>
  )
}

export default UserPostItem
