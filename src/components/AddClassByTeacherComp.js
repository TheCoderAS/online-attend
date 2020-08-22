import React from 'react'
import {Redirect} from 'react-router-dom'
import {Button, Collapse, Badge, Form, Input, Label} from 'reactstrap'
import fire from '../config/config'

class AddClass extends React.Component{
  constructor(props){
    super(props)
    this.state={
      redirect:false,
      name:'',
      openAdd:false,
      subject:'',
      classlink:'',
      classcode:'',
      time:'',
      duration:''
    }
    this.logout=this.logout.bind(this)
    this.handleChange=this.handleChange.bind(this)
    this.submitClass=this.submitClass.bind(this)
  }
  componentDidMount(){
    this.getCollegeName();
  }
  getCollegeName(){
    fire.database().ref(this.props.cid+'/college/').once("value").then((snapshot)=>{
      if(snapshot.val()){
        this.setState({name:snapshot.val().name})
      }
    })
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
  logout(){
    fire.auth().signOut().then(()=>{
      this.setRedirect();
    }).catch((err)=>{
      console.log(err.message)
    })
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  submitClass(e){
    e.preventDefault()
    this.setState({openAdd:false})

    var subject=e.target.subject.value
    var classlink=e.target.classlink.value
    var classcode=e.target.classcode.value
    var time=e.target.time.value
    var duration=e.target.duration.value
    var classid=this.makeid(10)
    
    fire.database().ref(this.props.cid+'/classes/'+classid).set({
      subject:subject,
      classlink:classlink,
      classcode:classcode,
      time:time,
      duration:duration,
      started:false,
      ended:false,
      classid:classid
    }).then(()=>{
      console.log('Class Added')
      window.location.reload()
    })
  }
  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
            <Button block color="primary" size="sm" onClick={()=>{
              fire.database().ref(this.props.cid+'/classes/'+value.classid).update({started:true}).then(()=>window.location.reload())
            }}>Start Class</Button>
          </Collapse>
          <Collapse isOpen={value.started&&!value.ended}>
            <h5><Badge color="success" onClick={this.endClass}>Class Started </Badge></h5>
            <Button block color="danger" size="sm" onClick={()=>{
              fire.database().ref(this.props.cid+'/classes/'+value.classid).update({ended:true}).then(()=>window.location.reload())
            }}>End Class</Button>
          </Collapse>
          <Collapse isOpen={value.started&&value.ended}>
            <h5><Badge color="danger">Class Ended</Badge></h5>
          </Collapse>
        </div>
      )
    })
    return(
      <div className="layout">
        <h5><Badge color="danger" onClick={()=>{window.location.reload()}}>Refresh</Badge></h5>
        <h4>{this.state.name}</h4><br/>
        <div className="teacher-panel">
          <h7 id="cid">College ID: <strong>{this.props.cid}</strong>  </h7>
          {this.renderRedirect()}
          <Button outline color="danger" size="sm" type="button" onClick={this.logout}><i className="fa fa-md fa-sign-out"></i>&nbsp;<strong>LogOut</strong></Button>
        </div>
        <div className="addclassbtn">
          <Button size="sm" color="primary" onClick={()=>this.setState({openAdd:!this.state.openAdd})}>Add Class</Button>
        </div>
          <Collapse isOpen={this.state.openAdd}>
            <Form onSubmit={this.submitClass}>
            <div className="form container">
              <div className="row">
                <div className="col-12">
                  <Label>Subject Name:</Label>
                  <Input name="subject" value={this.state.subject} type="text" onChange={this.handleChange} placeholder="Subject Name"/>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                <Label>Class Link:</Label>
                  <Input name="classlink" value={this.state.classlink} type="url" onChange={this.handleChange} placeholder="Class Link"/>
                </div>
                <div className="col-4">
                <Label>Class Code:</Label>
                  <Input name="classcode" value={this.state.classcode} type="text" onChange={this.handleChange} placeholder="Class Code"/>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                <Label>Time:</Label>
                  <Input name="time" value={this.state.time} type="text" onChange={this.handleChange} placeholder="Time"/>
                </div>
                <div className="col-4">
                <Label>Duration:</Label>
                <Input name="duration" value={this.state.duration} type="text" onChange={this.handleChange} placeholder="Duration"/>
                </div>
              </div>
              <div className="addclassbtn">
                <Button color="danger" outline size="sm" type="button" onClick={()=>this.setState({openAdd:false})}>Cancel</Button>&nbsp;&nbsp;&nbsp;
                <Button color="primary" size="sm" type="submit">Submit Class</Button>
              </div>
            </div>
            </Form>
          </Collapse>
        <div>
        <div className="classes">
            {(this.props.found)?(
              <>
                <h5>All Classes</h5>
                <div className="class">
                  {renderClasses}
                </div>
              </>
            ):(<h5>No Classes Found</h5>)}
          </div>
        </div>
      </div>
    )
  }
}

export default AddClass;