import React, { PropTypes as T } from 'react'
import jquery from 'jquery';
import './App.css';
import { Switch, Route } from 'react-router-dom';
// import { hashHistory } from 'react-router';

import Header from './components/Header';
import UserPanel from './components/UserPanel';
import Login from './components/Login';
import Newsfeed from './components/Newsfeed';
import UserPage from './components/UserPage';
import Account from './components/Account';
import SignedIn from './components/SignedIn';
import LandingPage from './components/LandingPage';

import AuthService from './utils/AuthService';
import { ConnectedRouter } from 'connected-react-router';
const authid = process.env.REACT_APP_AUTH0_CLIENT_ID;
const authdomain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth = new AuthService(authid, authdomain);
console.log('auth : ', auth);

//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { mainApp, fetchUserInfo, fetchPosts, getProfile,createNewUser, fetchAllUsers } from './actions/index';
import { push } from 'connected-react-router';

// validate authentication for private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/' })
  }
}

// authorize(e){
//   e.preventDefault();
// }

class App extends React.Component{

  constructor(props){
    super(props);
    this.state={
      profile:{},
      updated:false,
      affiliation:''
    }
  }
  componentWillMount(){
    console.log('mounting App.js!!!');
    let targetURL = "http://localhost:3001/user/"
    console.log('app js auth: ',auth);

    const profile = auth.getProfile();
  

  }
  componentWillReceiveProps(nextProps){
    let user = nextProps.user;
    console.log('user in willreceive: ',user);
    //if user is new, save auth username, affiliation, first, last, pic, big pic, userid, requests sent, received in STORE:
    //all of this is already saved in store under 'user'
    if(user !=='' && user.length===0){
       console.log('user empty! Not on file.');
       //create redux action to save new user in API:
       let userData = {
           first_name:this.props.profile.given_name,
           last_name:this.props.profile.family_name,
           photo:this.props.profile.picture,
           largephoto:this.props.profile.picture_large,
           userid:this.props.profile.clientID,
           ally_requests_sent:[],
           //give every new user a friend invitation from Forrest Gump:
           ally_invitations_received:['12345']
         };
      //  this.props.createNewUser(userData);
       this.props.push( '/account');
     }else{
       console.log('app.js has confirmed user exists');
     }

    // setTimeout(()=>{
      // const profile = this.props.profile;
      // console.log('cwm profile: ', profile);
      //   this.setState({
      //     profile:profile
      //   });

        // getting current user information MOVE ALL THIS TO WILL RECEIVE PROPS:

        // let query = jquery.ajax({
        //   url:targetURL+profile.clientID,
        //   type:'GET',
        //   success:(val)=>{
        //     console.log('user in app.js: ',val[0]);
        //     console.log('success: ',val[0]);
        //     console.log('username: ',val[0].username);
        //     console.log('affiliation in app.js: ',val[0].affiliation);
        //     let affiliation = val[0].affiliation;
        //     this.setState({
        //       username:val[0].username,
        //       affiliation:affiliation,
        //       user:val[0]
        //     });
        //   }
        // });
  //       query.done((val)=>{
  //         console.log('user in database: ',val);
  //
  //       });
  // },0);


    // let users;
    // targetURL = "http://localhost:3001/user/"
    // jquery.ajax({
    //   url:targetURL,
    //   type:"GET",
    //   success:(users)=>{
    //     console.log('all the users in the database: ',users);
    //     this.setState({
    //       users:users
    //     });
    //   }
    // });
  }
  logOut(){
    this.props.push('/landing');
    console.log('logging out');
    auth.logout();
  }
  toggle_affiliation(affiliation){
    console.log('working in App.js! ',affiliation);
    //change affiliation in store:
    this.setState({
      affiliation:affiliation
    });
  }
  update(user){
    console.log('Changing global user data: ',user);
    //change user data
    this.setState({
      affiliation:user.affiliation,
      username:user.username
    });
  }
  render(){
   let profile = auth.getProfile();
   let children = null;
   let user = (this.state.user) ? this.state.user : '';
   console.log('user in app.js render: ',user);
  //  let affiliation = (this.state.affiliation) ? this.state.affiliation : '';
   let affiliation = this.state.affiliation;
   console.log('affiliation app.js render: ',affiliation);
   let username = (this.state.username) ? this.state.username : '';
   console.log('username app.js render: ',username);
   let users = this.props.users;
   let update = this.update.bind(this);
  //  if (this.props.children) {
  //    children = React.cloneElement(this.props.children, {
  //      //sends props to children
  //      auth: auth,
  //      profile:profile,
  //      username:username,
  //      affiliation:affiliation,
  //      update:update,
  //      user:user
  //    })
  //  }
   let props = {
     //sends props to children
     auth,
     profile,
     username,
     affiliation,
     update,
     user
   }

   let x = this.props.user;
   console.log('appyj user: ',x);
   console.log('props in app are: ',props);
   return (
    <div>
      <Header uid={user.uid} affiliation={affiliation} toggle_affiliation={this.toggle_affiliation.bind(this)} logOut={this.logOut.bind(this)}/>
      {/* {children || <LandingPage />} */}
      <Switch>
        <Route exact path="/" render = {(props)=>(<LandingPage />)} />
        <Route path="/account" component={Account} />
        <Route path="/user" render = {(props)=>(<UserPage {...props} />)} />
        <Route path="/user/:uid" render = {(props)=>(<UserPage {...props} />)} />
        <Route path="/signedin" component={SignedIn} />
        <Route path="/newsfeed" render = {(props)=>(<Newsfeed {...props} />)} rand={Math.random()}  onEnter={requireAuth} />
        {/* <Route path="/newsfeed" component = {Newsfeed} onEnter={requireAuth} /> */}
        <Route path="/login" component={Login} />
      </Switch>
      <UserPanel/>
    </div>
  )
}
}

function mapStateToProps(state){
  let user = state.allReducers.mainApp.user;
  let profile = state.allReducers.mainApp.profile;
  let users = state.allReducers.mainApp.users;
  return{
    user,
    users,
    profile
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    mainApp,
    fetchUserInfo,
    push,
    getProfile,
    createNewUser,
    fetchAllUsers,
    fetchPosts
  },dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
