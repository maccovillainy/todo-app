import  React  from 'react';
import  ReactDOM  from 'react-dom';
import  ee  from 'event-emitter';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';

let app = document.querySelector('#hello'),
  emitter = ee({}), 
  listener,
  dataJSON = [
  {
    id: 0,
    name: "first board",
    tasks:[
      {
      id: 0,
      name: "task1",
      check: false
      },
      {
        id: 1,
        name: "task2",
        check: false
      },
      {
        id: 2,
        name: "task3",
        check: false
      },
      {
        id: 3,
        name: "task4",
        check: false
      }
    ]
  },
  {
    id: 1,
    name: "second board",
    tasks:[
      {
      id: 0,
      name: "task11",
      check: false
      },
      {
        id: 1,
        name: "task21",
        check: false
      },
      {
        id: 2,
        name: "task31",
        check: false
      },
      {
        id: 3,
        name: "task41",
        check: false
      }
    ]
  }
    
  ];
//localStorage.clear()
if ( !localStorage.getItem('data') ){
  localStorage.setItem('data', JSON.stringify(dataJSON))
}
let data = JSON.parse(localStorage.getItem('data'))


//////////////////////////////////////////////////

let users = [
  {
    id: 0,
    acces: 'admin',
    name: 'Ivan Ivanov'
  },
  {
    id: 1,
    acces: 'read',
    name: 'Vasia Pupkin'
  },
  {
    id: 2,
    acces: 'write',
    name: 'Petrovich'
  },
  {
    id: 3,
    acces: 'read',
    name: 'Ivan Sidorow'
  },
  {
    id: 4,
    acces: 'write',
    name: 'Andrew Pupkin'
  },
  {
    id: 5,
    acces: 'admin',
    name: 'John'
  },
]

//////////////////////////////////////////////////

class Access extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      addData: [],
      addToData: [],
      fullData: users,
      acces: 'read',
      value: ' '
    }
  }
  onChangeValue(e){
    let value = e.target.value.trim(), obj;
    if (value.length)
        obj = this.state.fullData.filter(user => {
          if (user.name.toLowerCase().indexOf(value) > -1 & user.acces.indexOf(this.state.acces) > -1) return true
          else false
        })
    else obj = [];
        this.setState({
          data: obj,
          value: value
        })
        console.log(value == true)
  }
  onPick(e){
    let acces = e.target.value;
        let obj,
        value = this.state.value;
        if (value.length)
        obj = this.state.fullData.filter(user => {
          if (user.name.toLowerCase().indexOf(value) > -1 & user.acces.indexOf(acces) > -1) return true
          else false
        })
    else obj = [];
        this.setState({
          data: obj,
          acces: acces
        })
  }
  onPickCertainUser(e){
    let user = e.target,
    newData = this.state.fullData.filter(item => {
      if (item.id === +user.getAttribute('data-id')){
        let newAddedData = this.state.addData.map(item => item)
        newAddedData.push(item)
        this.setState({addtoData: newAddedData})
        return false;
      }else{
        return item
      }
    })
    this.setState({fulltoData: newData})
  }
  addUser(){
    this.setState({
      addData: this.state.addtoData,
      fullData: this.state.fulltoData
    })
  }
  onDel(id, e){
    console.log(this.state.addData)
    let newFullData = this.state.fullData.map(item => item);
    console.log(newFullData)
    let newAddedData = this.state.addData.filter(item => {
      if (item.id === id){
        newFullData.push(item)
        return false
      }else{
       return  item
      }
     })
    this.setState({
      fullData: newFullData,
      addData: newAddedData
    })
    console.log(newFullData)
    console.log(newAddedData)
  }
  render(){
    let danger = this.state.value.length ? '' : 'danger';
    return(
      <div>
        <input className={danger} onChange={this.onChangeValue.bind(this)} />
        <select onChange={this.onPick.bind(this)}>
          <option>read</option>
          <option>write</option>
          <option>admin</option>
        </select>
        <button onClick={this.addUser.bind(this)}>Add</button>
        {this.state.data.map(item => (
          <p data-id={item.id} onClick={this.onPickCertainUser.bind(this)}key={item.id}>{item.name}</p>
        ))
        }
        {
          this.state.addData.map(item => (
            <div style={{border: '1px solid #69c'}} key={item.id}>
            <p >added: {item.name} <br/>{item.acces}</p>
            <button onClick={this.onDel.bind(this, item.id)}>delete</button>
            </div>
            ))
        }

      </div>
    )
  }
}

/////////////////////////////////////////////////


class Tasks extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      check: this.props.data.check
    }
  }
  OnCheck(i){
    this.setState({ check: !this.state.check })
    emitter.emit('checkUnCheck', i, this.props.parentId, this.state.check);
  }
  del(i){
    emitter.emit('deleted', i, this.props.parentId);
  }
  edit(){

  }
  render(){
    return(
      <div>

            <label className={ this.state.check ? 'selected' : '' }>{this.props.data.name}
              <input
                onChange={this.OnCheck.bind(this, this.props.id)} 
                type='checkbox'
                checked={this.state.check ? true : false } />
            </label>
            <a onClick={this.del.bind(this, this.props.data.id)} href='#' className='del'></a>
            <Link to={`/${this.props.data.name}/${this.props.data.id}/${this.props.parentId}`} onClick={this.edit.bind(this, this.props.data.id)} href='#' className=''>edit</Link>
      </div>
    )
  }
}

////////////////////////////////////

class Board extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.tasks.length,
      task: []
    }
  }
  componentDidMount() {
    this.setState({task: this.props.data.tasks})

    emitter.on('deleted', listener = (id, boardId )=>{
      if (boardId === this.props.id){
      let newData = this.state.task.filter((item, i) => item.id == id ? false : item)
      this.setState({task: newData})
      emitter.emit('toLS', newData, this.props.id)
    }
    })

    emitter.on('checkUnCheck', listener = (id, boardId, bul )=>{
      if (boardId === this.props.id){
      let newData = this.state.task.map((item, i) => {
        if (item.id == id) item.check = !item.check
          return item
      })
      this.setState({task: newData})
      emitter.emit('toLS', newData, this.props.id)
    }
    })

    emitter.on('rewriteText', listener = (text, id, boardId )=>{
      if (+boardId === this.props.id){
      let newData = this.state.task.map((item, i) => {
        if (item.id == +id) item.name = text
          return item
      })
      this.setState({task: newData})
      emitter.emit('toLS', newData, this.props.id)
    }
    })

  }
  add(){
      let newData = this.state.task.map(item => item)
      newData.push({
        name: ReactDOM.findDOMNode(this.refs.input).value,
        check: false,
        id: this.state.id++
      })
      this.setState({task: newData})
      emitter.emit('toLS', newData, this.props.id)
  }
  deleteBorder(elem){
    emitter.emit('delBoard', elem)
  }
  render(){
    return(
        <div style={{border: '1px solid tomato', margin: 20, width: 300}}>
              <h2>{this.props.data.name}</h2>
        {this.state.task.filter(item => item.check).length} of {this.state.task.length}
          <a onClick={this.deleteBorder.bind(this, this.props.id)} 
            style={{display: 'block'}} href='#'>
            Delete Board
          </a>
          <input ref='input'/>
          <button onClick={this.add.bind(this)}>Add task</button>
            <div>
              {this.state.task.map(item => (
                <Tasks key={item.id} id={item.id} parentId={this.props.id} data={item}/>
              ))}
            </div>
          
        </div>
        );
  }
}



//////////////////////////////////////////////////////////

class MainApp extends React.Component{
  constructor(props) {
    super()
    this.state = {
      data: data,
      id: data.length
    }
  }
  componentDidMount() {
    this.setState({
      data: data
    })

    emitter.on('delBoard', listener = id =>{
      let newData = this.state.data.filter(item => item.id == id ? false : item)
      this.setState({data: newData})
      localStorage.setItem('data', JSON.stringify(newData))
    })

    emitter.on('toLS', listener = (obj, id )=>{
      let newDataToLS = this.state.data.map(item =>{
        if (item.id === id) item.tasks = obj
          return item
      })
      localStorage.setItem('data', JSON.stringify(newDataToLS))
    })
  }
  add(){
      let newArr = this.state.data.map(item => item)
      newArr.push({
      name: ReactDOM.findDOMNode(this.refs.boardName).value,
      id: this.state.id++,
      tasks: []
    })
    this.setState({
      data: newArr
    })
      localStorage.setItem('data', JSON.stringify(newArr))
  }
  render(){
    return(
      <div>
        <div>
          {this.state.data.map((item,i) => (
            <Board key={item.id} id={item.id} data={item}/>
          ))}
        </div>
        <input ref='boardName' />
        <button onClick={this.add.bind(this)}>AddBoard</button>
        
        {this.props.children}
        <Access />
      </div>
    );
  }
}

////////////////////////////////////////////

class Repo extends React.Component{
  OnButton(){
    let info = ReactDOM.findDOMNode(this.refs.val).value
    emitter.emit('rewriteText', info, this.props.params.name, this.props.params.parent)
  }
  render(){
    return(
        <div>
          <Link style={{
            position: 'fixed',
            top: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 9999,
            background: 'rgba(0,0,0,.5)'
          }} to="/"></Link>
          <div style={{
            position: 'fixed',
            top: 'calc(50% - 100px)',
            left: 'calc(50% - 100px)',
            zIndex: 10000,
            width: 200,
            height: 200,
            padding: 20,
            background: '#fff',
            display: 'flex',
            flexFlow: 'column wrap',
            justifyContent: 'space-around'}}>
            <input ref='val' defaultValue={this.props.params.text}/>
            <button onClick={this.OnButton.bind(this)}>rewrite</button>
          </div>
        </div>
      )
  }
}



ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={MainApp}>
      <Route path='/:text/:name/:parent' component={Repo} />
    </Route>
  </Router>
  ,app
);

