import React from 'react'
import {Button, Form, FormGroup, Input, Collapse} from 'reactstrap'
import fire from '../config/config'
import * as firebase from 'firebase'

class Login extends React.Component{
  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      emails:'',
      passwords:'',
      passwordsc:'',
      name:'',
      phone:'',
      signup:false,
      forget:false,
      emailforg:''
    }
    this.handleChange=this.handleChange.bind(this)
    this.toggleSignUp=this.toggleSignUp.bind(this)
    this.toggleForget=this.toggleForget.bind(this)

  }
  loginForm(e){
    e.preventDefault();
    var password=e.target.password.value
    var email=e.target.email.value
    fire.auth().signInWithEmailAndPassword(email,password).then((user)=>{
      //console.log('Login Successful!\n'+JSON.stringify(user.user))
      console.log('Login Successful!\n')
    }).catch((err)=>{
      alert(err.message);
    })
  }

  toggleForget(){
    this.setState({forget:!this.state.forget,signup:false})
    console.log('Saala Password bhulta hai be???')
  }
  forgetPass(e){
    e.preventDefault();
    var email=e.target.emailforg.value
    fire.auth().sendPasswordResetEmail(email).then(()=>{
      alert('Link Sent to '+email+'. Follow the link to reset your password.\nThank You!')
    }).catch((err)=>{
      alert(err.message)
    })
  }
  signupForm(e){
    e.preventDefault();
    var name=e.target.name.value
    var email=e.target.emails.value
    var password=e.target.passwords.value
    var conf=e.target.passwordsc.value
    if(password.length>=6&&conf.length>=6&&password===conf){
    fire.auth().createUserWithEmailAndPassword
    (email,password)
    .then((user)=>{
      console.log('Signup Successful!')
      const currentUser=fire.auth().currentUser;
      currentUser.updateProfile({
        displayName:name,
      })
      }).catch((err)=>{
        alert(err.message)
      })
    }
    else
    alert('Password did not match!')
  }
  facebookLogin(){
    var provider=new firebase.auth.FacebookAuthProvider();
    fire.auth().signInWithPopup(provider).then((result)=>{
      console.log('Signed in with Facebook!')
    }).catch((err)=>{
      console.log(err.email+''+err.credential+''+err.message)
    })
  }
  googleLogin(){
    var provider=new firebase.auth.GoogleAuthProvider()
    fire.auth().signInWithPopup(provider).then((result)=>{
      console.log('Logged in with Google!')
    }).catch((err)=>{
      console.log(err.email+''+err.credential+''+err.message)
    })
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  toggleSignUp(){
    this.setState({signup:!this.state.signup,forget:false})
  }
  render(){
    return(
      <>
      <div className="login">
        <h1>Welcome to Online Attendance Manager!</h1>
        <br/>
        <Collapse isOpen={!this.state.signup&&!this.state.forget}>
          <Form onSubmit={this.loginForm}>
            <FormGroup>
              <div className="row">
                <div className="offset-1 col-10">
                  <Input onChange={this.handleChange} name="email" value={this.state.email} type="email" placeholder="Enter Email"/>
                </div>
              </div>
              <div className="row">
                <div className="offset-1 col-10">
                  <Input onChange={this.handleChange} name="password" value={this.state.password} type="password" placeholder="Enter Password"/>
                </div>
              </div>
              <div className="row">
                <div className="offset-1 col-10">
                  <Button block outline size="md" type="submit" color="dark"><i className="fa fa-lg fa-sign-in"></i>&nbsp;&nbsp;Log In</Button>
                </div>
              </div>
            </FormGroup>
          </Form>
        </Collapse>
        <Collapse isOpen={this.state.forget}>
          <Form onSubmit={this.forgetPass}>
            <FormGroup>
              <div className="row">
                <div className="offset-1 col-10">
                  <Input onChange={this.handleChange} name="emailforg" value={this.state.emailforg} type="email" placeholder="Enter Email"/>
                </div>
              </div>
              <div className="row">
                <div className="offset-1 col-10">
                  <Button block outline size="md" type="submit" color="dark"><i className="fa fa-lg fa-link"></i>&nbsp;&nbsp;Send Email</Button>
                </div>
              </div>
            </FormGroup>
          </Form>
        </Collapse>
        <Collapse isOpen={this.state.signup}>
        <Form onSubmit={this.signupForm}>
          <FormGroup>
          <div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="name" value={this.state.name} type="name" placeholder="Enter Name"/>
              </div>
            </div>
            <div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="emails" value={this.state.emails} type="email" placeholder="Enter Email"/>
              </div>
            </div>
            {/*<div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="phone" value={this.state.phone} type="tel" placeholder="Mobile No."/>
              </div>
            </div>*/}
            <div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="passwords" value={this.state.passwords} type="password" placeholder="Enter Password" htmlFor="passwords"/>
              </div>
            </div>
            <div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="passwordsc" value={this.state.passwordsc} type="password" placeholder="Confirm Password" htmlFor="passwordsc"/>
              </div>
            </div>
            <div className="row">
              <div className="offset-1 col-10">
                <Button block outline size="md" type="submit" color="dark"><i className="fa fa-lg fa-user-plus"></i>&nbsp;&nbsp;Create Account</Button>
              </div>
            </div>
          </FormGroup>
        </Form>
        </Collapse>
        <br/><h7 id="h" onClick={this.toggleForget}>{this.state.signup?(''):(<i>Forgotten Password?</i>)}</h7>
        <br/><h6 id="h" onClick={this.toggleSignUp}>{this.state.signup?(<u>Already have account. Click Here!</u>):(<u>Not an account. Click Here!</u>)}</h6>
        <h6><strong>OR</strong></h6>
        <Button block size="md" type="button" color="primary" onClick={this.facebookLogin}><i className="fa fa-lg fa-facebook"></i>&nbsp;&nbsp;Continue with Facebook</Button>
        <Button block size="md" type="button" color="success" onClick={this.googleLogin}><i className="fa fa-lg fa-google"></i>&nbsp;&nbsp;Continue with Google</Button>
      </div>
      <footer className="footer">
        &#169;aku-online|@2020
      </footer>
      </>
  )
  }
}

export default Login;