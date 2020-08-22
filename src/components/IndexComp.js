import React from 'react'
import {Link} from 'react-router-dom'

class Index extends React.Component{
  render(){
    return(
      <div className="layout">
        <h1>Index</h1>
        <h1>This is Index Page.</h1>
        <Link to="/student" className="index">Student Login/Register</Link><br/>
        <Link to="/teacher" className="index">Teacher Login</Link>
      </div>
    )
  }
}

export default Index;