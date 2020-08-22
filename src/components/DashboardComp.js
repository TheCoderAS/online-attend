import React from 'react'
import {Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form,Input, Collapse} from 'reactstrap'
import fire from '../config/config'
import {Link} from 'react-router-dom'
class Dashboard extends React.Component{
  constructor(props){
    super(props)
    this.state={
      isOpen:false,
      confirmdelete:false,
      collegeid:'',
      roll:'',
      present:false
    }

    this.connectCollege=this.connectCollege.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.disconnectCollege=this.disconnectCollege.bind(this)
  }
  connectCollege(e){
    e.preventDefault()
    var collegeid=e.target.collegeid.value
    var roll=e.target.roll.value

    this.setState({isOpen:false})

    fire.database().ref(collegeid+'/college/')
    .on("value",(snapshot)=>{
      if(snapshot.val()){
        console.log(snapshot.val().id)
        var collegename=snapshot.val().name

        this.setState({connected:true})

        fire.database().ref('users/'+this.props.user.uid)
        .set({
          connected:true,
          id:collegeid,
          collegename:collegename,
          teacher:false
        });

        fire.database().ref(collegeid+'/college/students/'+this.props.user.uid)
        .set({
          roll:roll,
          name:this.props.user.displayName},(err)=>{
            if(err)
            console.log(err)
            else
            console.log("OK")
            window.location.reload()
          })
      }
      else{
        alert('No College Found with id '+collegeid)
      }
    })
  }
  disconnectCollege(){
    this.setState({confirmdelete:false})
    fire.database().ref('users/'+this.props.user.uid).remove().then((result)=>{
      fire.database().ref(this.props.college.id+'/college/students/'+this.props.user.uid).remove().then((result)=>{
        console.log('Successfully Deleted')
        window.location.reload();
      })
    }).catch((err)=>console.log(err))
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  render(){  
    const renderClasses=this.props.classes.map((value)=>{
      return(
        <div className="list" key={value.classid}>
        <ul className="list-unstyled" >
          <li>Subject: {value.subject}</li>
          <li>Class Link: <a href={value.classlink} id="link">{value.classlink}</a></li>
          <li>Class Code: {value.classcode}</li>
          <li>Time: {value.time}</li>
          <li>Duration: {value.duration}</li>
        </ul>
        <Collapse isOpen={(!value.started)&&(!value.ended)}>
            <h5><Badge color="primary" onClick={this.endClass}>Not Started</Badge></h5>
          </Collapse>
          <Collapse isOpen={value.started&&!value.ended}>
            <h7><Badge color="success" onClick={this.endClass}>Class Started </Badge></h7>
            <Button color="primary" block size="sm" onClick={()=>{
            console.log('Present')
            console.log(value.classid)
            fire.database().ref(this.props.college.id+'/classes/'+value.classid+'/attendance').set({roll:this.props.roll,name:this.props.user.displayName,present:true}).then(()=>{
              alert('Successful! Now click on the class link to attennd class, after then your attendance will be recorded !!.')
              window.location.reload()

            })
          }}>Attend Class</Button>
          </Collapse>
          <Collapse isOpen={value.started&&value.ended}>
            <h5><Badge color="danger">Class Ended</Badge></h5>
          </Collapse>
        </div>
      )
    })
  return(
      <div className="layout">
        <div className="dashboard">
          <h2>Dashboard</h2>
        </div>
        {this.props.college.connected?(
          <>
            <div className="id-roll">
            <div className="row">
              <div className="col-8">
                <h7>{this.props.college.collegename}</h7>
                <p id="id">College Id: {this.props.college.id}  <Badge color="dark" onClick={()=>this.setState({confirmdelete:true})}>Disconnect</Badge></p>
              </div>
              <div className="col-4">
                <h7>Roll No.: {this.props.roll}</h7>
              </div>
            </div>
          </div>
          <Modal isOpen={this.state.confirmdelete} toggle={()=>this.setState({confirmdelete:!this.state.confirmdelete})}>
            <ModalHeader>Disconnect</ModalHeader>
            <ModalBody>Disconnecting will delete your all previous data and attendance data!!
            <br/><br/>Press OK to continue.</ModalBody>
            <ModalFooter>
              <Button color="danger" size="sm" onClick={this.disconnectCollege}>OK</Button>
              <Button color="success" size="sm" onClick={()=>this.setState({confirmdelete:false,delete:false})}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <div className="classes">
            {(this.props.found)?(
              <>
                <h5>All Classes</h5>
                <Link to="/home"><h6><Badge color="primary">Expand<span className="fa fa-lg fa-caret-down"></span></Badge></h6></Link>
                <div className="class">
                  {renderClasses}
                </div>
              </>
            ):(<h5>No Classes Found</h5>)}
          </div>
        </>
        ):(
          <div>
            <h7>Connect with your College/Institution. <Badge color="danger" onClick={()=>this.setState({isOpen:!this.state.isOpen})}>Connect</Badge></h7>
            <Modal isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:!this.state.isOpen})}>
              <Form onSubmit={this.connectCollege}>
                <ModalHeader>
                  Connect to College/Institute
                </ModalHeader>
                <ModalBody>
                  <div className="row">
                    <div className="col-12">
                      <Input name="collegeid" value={this.state.collegeid} type="text" placeholder="College Id" onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <Input name="roll" value={this.state.roll} type="text" placeholder="Roll No." onChange={this.handleChange}/>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" size="sm" color="primary" block outline>Connect</Button>
                  <Button type="button" size="sm" color="danger" outline block onClick={()=>this.setState({isOpen:false})}>Cancel</Button>

                </ModalFooter>
              </Form>
            </Modal>
          </div>
        )}
      </div>
    )
  }
}

export default Dashboard;