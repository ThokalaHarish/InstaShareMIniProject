import {Component} from 'react'

import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './Context/CartContext'
import MyProfile from './components/MyProfile'
import UserProfile from './components/UserProfile'

import './App.css'

class App extends Component {
  state = {
    searchCaption: '',
  }

  onChangeSearchCaption = value => {
    this.setState({searchCaption: value})
  }

  render() {
    const {searchCaption} = this.state
    return (
      <CartContext.Provider
        value={{
          searchCaption,
          onChangeSearchCaption: this.onChangeSearchCaption,
        }}
      >
        <Switch>
          <Route path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
