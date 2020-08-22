import React from 'react'
import {Button, Badge, Modal, ModalBody, ModalHeader,Input,ModalFooter, Form,Collapse} from 'reactstrap'
import fire from '../config/config'
import * as firebase from 'firebase'

class Profile extends React.Component{
  constructor(props){
    super(props)
    this.state={
      user:this.props.user,
      isOpen:false,
      name:'',
      email:'',
      password:'',
      isName:false,
      isEmail:false,
      isPassword:false,
      current:'',
    }
    this.verifyEmail=this.verifyEmail.bind(this)
    this.openEdit=this.openEdit.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.editProfile=this.editProfile.bind(this)
  }
  openEdit(){
    this.setState({isOpen:!this.state.isOpen})
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  reauthenticate = (currentPassword) => {
    var user = fire.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }
  editProfile(e){
    e.preventDefault()
    this.setState({isOpen:!this.state.isOpen})
    var name=e.target.name.value
    var email=e.target.email.value
    var password=e.target.password.value
    var current=e.target.current.value
    if(email||password){
        this.reauthenticate(current).then(()=>{
        var user=fire.auth().currentUser
        if(email){
          user.updateEmail(email).then(()=>{
            console.log('Email Updated')
          }).catch((err)=>alert(err.message))
        }
        if(password){
          user.updatePassword(password).then(()=>{
            console.log('Password Updated')
          }).catch((err)=>alert(err.message))
        }  
      })
    }
    if(name){
      var user=fire.auth().currentUser
      user.updateProfile({
        displayName:name,
      }).then(()=>{
        console.log('Name Updated')
      }).catch((err)=>alert(err.message))
    }
  }
  verifyEmail(){
    if(!this.state.user.emailVerified){
      fire.auth().currentUser.sendEmailVerification().then(()=>{
        alert('Verification link sent')
      })
    }
  }
  render(){
    return(
      <>
        <div className="edit">
          <span className="editprof fa fa-pencil fa-md" onClick={this.openEdit}>Edit Profile</span>
        </div>
        <div className="layout prof">
          <img src={this.state.user.photoURL?(this.state.user.photoURL):('https://webstockreview.net/images/profile-icon-png-9.png')} className="profilepic" alt=""/>
          <h3>{this.state.user.displayName}</h3>
        </div>
        <div className="details">
          <div className="collegeinfo">
            <h6>{this.props.college.collegename}</h6>
            <h6>{this.props.college.connected?(<Badge color="success">Connected</Badge>):(<Badge color="warning">Not Connected</Badge>)}</h6>
            <h6>ID: {this.props.college.id}</h6>
          </div>
          <h6>Email: {this.state.user.email}  <Badge onClick={this.verifyEmail} color="danger">{this.state.user.emailVerified?('Verified'):('Not Verified')}</Badge></h6>
        </div>
        <Modal isOpen={this.state.isOpen} toggle={this.openEdit}>
          <ModalHeader className="modal-header">
            Edit Profile
          </ModalHeader>
          <Form onSubmit={this.editProfile}>
          <ModalBody className="modal-body">
          <div className="options">
              <div className="row">
                <div className="col-4">
                  <span className=" option fa fa-sm fa-pencil" onClick={()=>this.setState({isName:!this.state.isName})}>Change Name</span>
                </div>
                <div className="col-4">
                  <span className=" option fa fa-sm fa-pencil" onClick={()=>this.setState({isEmail:!this.state.isEmail})}>Change Email</span>
                </div>
                <div className="col-4">
                  <span className="option fa fa-sm fa-pencil" onClick={()=>this.setState({isPassword:!this.state.isPassword})}>Change Password</span>
                </div>
              </div>
            </div>
            <Collapse isOpen={this.state.isName}>
              <div className="row">
                <div className="col-12">
                  <Input name="name" value={this.state.name} type="name" placeholder="Name" onChange={this.handleChange}/>
                </div>
              </div>
            </Collapse>
            <Collapse isOpen={this.state.isEmail}>
              <div className="row">
                <div className="col-12">
                  <Input name="email" value={this.state.email} type="email" placeholder="Email" onChange={this.handleChange}/>
                </div>
              </div>
            </Collapse>
            <Collapse isOpen={this.state.isPassword||this.state.isEmail}>
              <div className="row">
                <div className="col-12">
                  <Input name="current" value={this.state.current} type="password" placeholder="Current Password" onChange={this.handleChange}/>
                </div>
              </div>
            </Collapse>
            <Collapse isOpen={this.state.isPassword}>
            <div className="row">
              <div className="col-12">
                <Input name="password" value={this.state.password} type="password" placeholder="New Password" onChange={this.handleChange}/>
              </div>
            </div>
            </Collapse>
          </ModalBody>
          <ModalFooter className="modal-footer">
            <Button type="submit" size="sm" color="primary" outline block>Done</Button>
            <Button type="button" size="sm" color="primary" outline block onClick={()=>this.setState({isOpen:false})}>Cancel</Button>
          </ModalFooter>
          </Form>
        </Modal>
      </>
    )
  }
}

export default Profile;