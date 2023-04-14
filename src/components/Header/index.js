import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {BiSearch} from 'react-icons/bi'

import CartContext from '../../Context/CartContext'

import './index.css'

class Header extends Component {
  render() {
    const {onClickedSearchBar, onChangeSearchStatus, selectedRoute} = this.props
    return (
      <CartContext.Consumer>
        {value => {
          const {onChangeSearchCaption, searchCaption} = value

          const onChangeSearchInput = event => {
            onChangeSearchCaption(event.target.value)
            onChangeSearchStatus(event.target.value)
          }

          const onClickLogoutBtn = () => {
            Cookies.remove('jwt_token')
            const {history} = this.props
            history.replace('/login')
          }

          const onChangeKeyEnter = event => {
            if (event.key === 'Enter') {
              onClickedSearchBar(searchCaption)
              onChangeSearchCaption('')
            }
          }

          const onClickSearchBtn = () => {
            onClickedSearchBar(searchCaption)
            onChangeSearchCaption('')
          }

          return (
            <>
              <nav className="navbar-Header-container">
                <div className="navbar-content-container">
                  <Link to="/">
                    <div className="website-logo-container">
                      <img
                        src="https://res.cloudinary.com/ths-company/image/upload/v1680116030/Group_1_chgt0g.png"
                        className="website-logo"
                        alt="website logo"
                      />
                      <h1 className="navbar-title">Insta Share</h1>
                    </div>
                  </Link>
                  <div className="nav-search-container">
                    <div className="search-input-card">
                      <input
                        type="search"
                        className="search-input"
                        placeholder="Search Caption"
                        value={searchCaption}
                        onChange={onChangeSearchInput}
                        onKeyDown={onChangeKeyEnter}
                      />
                      <button
                        type="button"
                        className="search-btn"
                        data-testid="searchIcon"
                        onClick={onClickSearchBtn}
                      >
                        <BiSearch className="search-icon" />
                      </button>
                    </div>
                    <ul className="nav-list-item">
                      <li>
                        <Link
                          to="/"
                          className={
                            selectedRoute === 'Home'
                              ? `nav-link selectedLink`
                              : 'nav-link'
                          }
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-profile"
                          className={
                            selectedRoute === 'my-profile'
                              ? `nav-link selectedLink`
                              : 'nav-link'
                          }
                        >
                          Profile
                        </Link>
                      </li>
                      <button
                        className="log-button"
                        type="button"
                        onClick={onClickLogoutBtn}
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </nav>
              <hr />
            </>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default withRouter(Header)
