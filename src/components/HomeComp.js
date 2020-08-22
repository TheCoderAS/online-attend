import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import Header from './HeaderComp'
import Footer from './FooterComp'
import firebase from '../config/config'
import fire from '../config/config'
import StudentLogin from './StudentLoginPage'
import TeacherLogin from './TeacherLoginPage'
import Dashboard from './DashboardComp'
import Index from './IndexComp'
import Contact from './ContactComp'
import About from './AboutComp'
import Profile from './ProfileComp'
import AddClass from './AddClassByTeacherComp'

class Home extends React.Component{
  constructor(props){
    super (props)
    this.state={
      user:[],
      status:false,
      college:[],
      roll:'',
      found:false,
      classes:[],
      teacher:null,
      id:''
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
      this.collegSetter(user.uid)
      this.torsSetter(user.uid)
      //console.log(this.state.user.photoURL)
      
    }
    else{
      this.setState({status:false,user:[],teacher:false})
      console.log('Not Logged In!')
    }
  })
  }
  collegSetter(uid){
    fire.database().ref('users/'+uid).once("value").then((snapshot)=>{
      if(snapshot.val()&&snapshot.val().connected)
      {
        if(!snapshot.val().teacher){
          console.log('College Found')
          this.setState({college:snapshot.val()})

          fire.database().ref(snapshot.val().id+'/college/students/'+uid)
          .on("value",(snapshot)=>{

            this.setState({roll:snapshot.val().roll})
          })
        }
        fire.database().ref(snapshot.val().id+'/classes')
        .on("value",(snapshot)=>{
          if(snapshot.val()){
            this.setState({found:true})
            snapshot.forEach((childSnap)=>{
              var item=childSnap.val()
              this.state.classes.push(item)
            })
            //console.log(this.state.classes)
          }
          else{
            console.log('No Classes Found ')
          }
        })
      }
      else{
        this.setState({college:[]})
        console.log('College Not Connected')
      }
    })
  }
  torsSetter(uid){
    fire.database().ref('tors/'+uid).once("value").then((snapshot)=>{
      //console.log(snapshot.val())
      if(snapshot.val())
      this.setState({teacher:snapshot.val().teacher,id:snapshot.val().id?snapshot.val().id:''})
    })
  }
  render(){
  return (
    <Switch>
      {(this.state.status)?(
        (!this.state.teacher)?(
          <>
            <Header displayName={this.state.user.displayName} photoUrl={this.state.user.photoURL}/>
            <Route exact path="/home" component={()=><Dashboard user={this.state.user} college={this.state.college} classes={this.state.classes} found={this.state.found} roll={this.state.roll}/>}></Route>
            <Route exact path="/contact" component={()=><Contact/>}></Route>
            <Route exact path="/about" component={()=><About/>}></Route>
            <Route exact path="/profile" component={()=><Profile user={this.state.user} college={this.state.college}/>}></Route>
            <Redirect to="/home"/>
            <Footer/>
          </>
        ):(
          <>
            <Route exact path="/addclass" component={()=><AddClass cid={this.state.id} classes={this.state.classes} found={this.state.found}/>}></Route>
            <Redirect to="/addclass"/>
            <Footer/>
          </>
        )
      ):(
        <>
        <Route exact path="/student" component={()=><StudentLogin/>}></Route>
        <Route exact path="/teacher" component={()=><TeacherLogin/>}></Route>
        <Route exact path="/" component={()=><Index/>}></Route>
        <Redirect to="/"/>
        <Footer/>
        </>
      )}
    </Switch>
  )
}
}
export default Home;