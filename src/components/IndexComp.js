import React from 'react'
import {Link} from 'react-router-dom'

class Index extends React.Component{
  render(){
    return(
      <div className="layout">
        <h1>Index</h1>
        <h1>This is Index Page.</h1>
        <Link to="/user" className="index">Login/Register</Link>
      </div>
    )
  }
}

export default Index;