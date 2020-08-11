import React from 'react'
import {Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form,Input} from 'reactstrap'
import fire from '../config/config'
import {Link} from 'react-router-dom'

class Dashboard extends React.Component{
  constructor(props){
    super(props)
    this.state={
      classes:[],
      collegeid:null,
      roll:null,
      collegename:null,
      isOpen:false,
      connected:false,
      found:false
    }

    this.connectCollege=this.connectCollege.bind(this)
    this.handleChange=this.handleChange.bind(this)
  }
  componentDidMount(){
    fire.database().ref(this.props.user.uid)
    .on("value",(snapshot)=>{

      if(snapshot.val()&&snapshot.val().connected){
        //console.log(snapshot.val().id)

        this.setState({
          connected:true,
          collegeid:snapshot.val().id,collegename:snapshot.val().collegename
        })

        fire.database().ref(snapshot.val().id+'/college/'+this.props.user.uid)
        .on("value",(snapshot)=>{

          this.setState({roll:snapshot.val().roll})
        })
        fire.database().ref(snapshot.val().id+'/college/classes')
        .on("value",(snapshot)=>{
          if(snapshot.val()){
            this.setState({found:true})
            snapshot.forEach((childSnap)=>{
              var item=childSnap.val()
              this.state.classes.push(item)
            })
          }
          else{
            console.log('No Classes Found ')
          }
        })
      }
      else{
        console.log('Not Connected')
      }
    })
  }
  /*makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }*/
  connectCollege(e){
    e.preventDefault()
    var collegeid=e.target.collegeid.value
    var roll=e.target.roll.value

    this.setState({isOpen:false})

    //fire.database().ref(collegeid+'/college/').set({id:collegeid,name:'National Institute of Technology, Hamirpur'})

    //fire.database().ref(collegeid+'/college/classes/'+this.makeid(8)).set({subject:'Engineering Mathematics-II',classlink:'https://linktomyinfo.web.app',classcode:'we23r5k',time:'01:00 PM 13/08/2020',duration:'60 minutes'})

    fire.database().ref(collegeid+'/college/')
    .on("value",(snapshot)=>{
      if(snapshot.val().id){
        console.log(snapshot.val().id)
        var collegename=snapshot.val().name

        this.setState({connected:true})

        fire.database().ref(this.props.user.uid)
        .set({
          connected:true,
          id:collegeid,
          collegename:collegename
        });

        fire.database().ref(collegeid+'/college/'+this.props.user.uid)
        .set({
          roll:roll,
          name:this.props.user.displayName},(err)=>{
            if(err)
            console.log(err)
            else
            console.log("OK")
          })
      }
    })
  }
  handleChange(e){
    this.setState({[e.target.name]:e.target.value})
  }
  render(){  
    const renderClasses=this.state.classes.map((value)=>{
      return(
        <ul className="list-unstyled list">
          <li>Subject: {value.subject}</li>
          <li>Class Link: <a href={value.classlink} id="link">{value.classlink}</a></li>
          <li>Class Code: {value.classcode}</li>
          <li>Time: {value.time}</li>
          <li>Duration: {value.duration}</li>
        </ul>
      )
    })
  return(
      <div className="layout">
        <div className="dashboard">
          <h2>Dashboard</h2>
        </div>
        {this.state.connected?(
          <>
            <div className="id-roll">
            <div className="row">
              <div className="col-8">
                <h7>{this.state.collegename}</h7>
                <p id="id">College Id: {this.state.collegeid}</p>
              </div>
              <div className="col-4">
                <h7>Roll No.: {this.state.roll}</h7>
              </div>
            </div>
          </div>
          <div className="classes">
            {(this.state.found)?(
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