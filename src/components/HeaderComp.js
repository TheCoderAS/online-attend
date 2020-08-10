import React from 'react'
import {Navbar,Nav, NavItem, Collapse, Button} from 'reactstrap'
import firebase from '../config/config'
import { Redirect, NavLink } from 'react-router-dom'
class Header extends React.Component{
  constructor(props){
    super(props)
    this.state={
      isOpen:false,
      redirect:false
    }
    this.toggle=this.toggle.bind(this)
    this.logout=this.logout.bind(this)
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/user' />
    }
  }
  toggle(){
    this.setState({isOpen:!this.state.isOpen})
  }
  logout(){
    firebase.auth().signOut().then(()=>{
      this.setRedirect();
    }).catch((err)=>{
      console.log(err.message)
    })
  }
  render(){
  return (
    <header>
      <Navbar dark color="dark" expand="sm" fixed="top" >
        <Button outline size="sm" color="info" onClick={this.toggle} className="toggle"><span className="fa fa-bars fa-lg"></span></Button>
        <Nav navbar>
          <NavItem className="navitem">
            <NavLink to="/profile"><img id="dp"src={this.props.photoUrl} alt="" height="35"/></NavLink>
          </NavItem>
        </Nav>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar className="mr-auto">
            <NavItem className="navitem">
              <NavLink onClick={()=>this.setState({isOpen:!this.state.isOpen})} id="name" to="/profile">{this.props.displayName}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={()=>this.setState({isOpen:!this.state.isOpen})} to="/home" className="navitem">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={()=>this.setState({isOpen:!this.state.isOpen})} to="/contact" className="navitem">Contact Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={()=>this.setState({isOpen:!this.state.isOpen})} to="/about" className="navitem">About Us</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
        <Nav className="ml-auto" navbar>
          <NavItem>
            {this.renderRedirect()}
            <Button outline color="danger" size="sm" type="button" onClick={this.logout}><i className="fa fa-md fa-sign-out"></i>&nbsp;<strong>LogOut</strong></Button>
          </NavItem>
        </Nav>
      </Navbar>
    </header>
  )
}
}

export default Header;