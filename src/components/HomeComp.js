import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import Header from './HeaderComp'
import firebase from '../config/config'
import Login from './LoginPage'
import Dashboard from './DashboardComp'
import Index from './IndexComp'
import Contact from './ContactComp'
import About from './AboutComp'
import Profile from './ProfileComp'

class Home extends React.Component{
  constructor(props){
    super (props)
    this.state={
      user:[],
      status:false,
    }
  }

  componentDidMount(){
    this.authListener();
  }
  authListener(){
  firebase.auth().onAuthStateChanged((user)=>{
    if(user!=null)
    {
      this.setState({status:true,user:user})
      console.log('Logged In!')
      //console.log(this.state.user.photoURL)
    }
    else{
      this.setState({status:false,user:[]})
      console.log('Not Logged In!')
    }
  })
  }
  render(){
  return (
    <Switch>
      {this.state.status?(
        <>
          <Header displayName={this.state.user.displayName} photoUrl={this.state.user.photoURL}/>
          <Route exact path="/home" component={()=><Dashboard/>}></Route>
          <Route exact path="/contact" component={()=><Contact/>}></Route>
          <Route exact path="/about" component={()=><About/>}></Route>
          <Route exact path="/profile" component={()=><Profile user={this.state.user}/>}></Route>
          <Redirect to="/home"/>
        </>
      ):(
        <>
        <Route exact path="/user" component={()=><Login/>}></Route>
        <Route exact path="/" component={()=><Index/>}></Route>
        <Redirect to="/"/>
        </>
      )}
    </Switch>
  )
}
}
export default Home;