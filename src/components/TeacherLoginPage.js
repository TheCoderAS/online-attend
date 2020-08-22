import React from 'react'
import {Button, Form, FormGroup, Input, Collapse} from 'reactstrap'
import fire from '../config/config'
import logo from '../logo.png';

class TeacherLogin extends React.Component{
  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      emails:'',
      passwords:'',
      passwordsc:'',
      name:'',
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
      console.log('Teacher Login Successful!\n')
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
      fire.database().ref('tors/'+user.user.uid).set({teacher:true,id:user.user.uid}).then(()=>{
        console.log('College Registration Successful!')
      })
      fire.database().ref(user.user.uid+'/college/').set({id:user.user.uid,name:name})
      fire.database().ref('users/'+user.user.uid).set({
        collegename:name,connected:true,id:user.user.uid,teacher:true
      })
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
        <img src={logo} alt="logo" className="logo"/>
        <h1>Welcome to Online Attendance Manager!</h1>
        <br/>
        <h3><u>Teacher Section</u></h3>
        <Collapse isOpen={!this.state.signup&&!this.state.forget}>
          <Form onSubmit={this.loginForm}>
            <FormGroup>
              <div className="row">
                <div className="offset-1 col-10">
                  <Input onChange={this.handleChange} name="email" value={this.state.email} type="email" placeholder="College/Institute Email"/>
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
                  <Input onChange={this.handleChange} name="emailforg" value={this.state.emailforg} type="email" placeholder="College/Institute Email"/>
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
                <Input onChange={this.handleChange} name="name" value={this.state.name} type="name" placeholder="College/Institute Name"/>
              </div>
            </div>
            <div className="row">
              <div className="offset-1 col-10">
                <Input onChange={this.handleChange} name="emails" value={this.state.emails} type="email" placeholder="College/Institute Email"/>
              </div>
            </div>
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
        <br/>
        <h7 id="h" onClick={this.toggleForget}>{this.state.signup?(''):(<i>Forgotten Password?</i>)}</h7>
        <br/><h6 id="h" onClick={this.toggleSignUp}>{this.state.signup?(<u>Already have College/Institute ID? Click Here.</u>):(<u>Not have College/Institute ID. Click Here!</u>)}</h6>

        <br/><br/><br/><br/>
        <div className="note">
          <h7><strong>Note:</strong> College/Institue are allowed to register only one time with <strong>College/Institute Email</strong> and a Password. This will generate a unique id (this will bee college ID), which should be distributed among teachers and students.</h7><br/>
          <h7><strong>Caution: </strong>Do not share password to students! </h7>
        </div>
      </div>
      </>
  )
  }
}

export default TeacherLogin;