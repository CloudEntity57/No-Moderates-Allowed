import React, { Component } from 'react';
import Header from './Header';
import StoryLinks from './StoryLinks';
import Post from './Post';
import Posts from './Posts';
import UserPanel from './UserPanel';
import { filterUser } from './FilterUser';
import jquery from 'jquery';
import { hashHistory } from 'react-router';
import { nyt_feed } from './apis/NYT_API';
import { wp_feed } from './apis/WP_API';
import { breitbart_feed } from './apis/BREIT_API';
const nytkey=process.env.REACT_APP_NYTAPI;
const wpkey=process.env.REACT_APP_WP_API;


class Newsfeed extends Component{
  constructor(props){
    super(props);
    this.state={
      test:'',
      stories:[],
      affiliation:this.props.affiliation
    }
  }
  componentWillMount(){
    console.log('api key: ',nytkey);
    let affiliation = this.state.affiliation;
    console.log('affiliation in newsfeed: ',affiliation);
    let fullfeed=[];
    let result;
    // let setLiberal = (fullfeed)=>{
    //   this.setState({
    //     liberalstories:fullfeed
    //   });
    // }
    // let setConservative = (fullfeed)=>{
    //   this.setState({
    //     conservativestories:fullfeed
    //   });
    // }
    let callback = (stories)=>{
      console.log('stories in callback: ',stories);
      fullfeed=fullfeed.concat(stories);
      this.setState({
        stories:fullfeed
      });
    }
      this.getNews(callback);
  }
  getNews(callback){
    nyt_feed(nytkey,callback);
    wp_feed(wpkey,callback);
    breitbart_feed(callback);
  }
  shuffle(array){
    //Fisher-Yates shuffle algorithm:
    //Fisher-Yates shuffle algorithm:
       var currentIndex = array.length, temporaryValue, randomIndex;

       // While there remain elements to shuffle...
       while (0 !== currentIndex) {

         // Pick a remaining element...
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;

         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
     }

       return array;
  }
  // componentDidMount(){
  //   let auth = this.props.auth;
  //   let targetURL = "http://localhost:3001/user/"
  //   console.log('app js auth: ',auth);
  //
  //   setTimeout(()=>{
  //     // const profile = auth.getProfile();
  //     const profile = this.props.profile;
  //     console.log('cwm profile: ', profile);
  //     console.log('app js profile: ',profile);
  //       this.setState({
  //         profile:profile
  //       });
  //       let query = jquery.ajax({
  //         url:targetURL+profile.clientID,
  //         type:'GET',
  //         success:(val)=>{
  //           console.log('success: ',val);
  //         }
  //       });
  //       query.done((val)=>{
  //         console.log('user in database: ',val);
  //         if(!val || val.length===0){
  //           console.log('val empty! Not on file.');
  //           let post = jquery.ajax({
  //             url:targetURL,
  //             data:{
  //               first_name:profile.given_name,
  //               last_name:profile.family_name,
  //               photo:profile.picture,
  //               userid:profile.clientID
  //             },
  //             type:'POST'
  //           });
  //           hashHistory.push('/account');
  //         }
  //       });
  // },1000);
    // setTimeout(()=>{
    //
    // },300);
  // }
  render(){
    const profile = this.props.auth.getProfile();
    if(profile !== {}){
      console.log('render profile: ', profile);
    }
    // let affiliation = (this.state.affiliation) ? this.state.affiliation : '';
    let affiliation = this.props.affiliation;
    console.log('affiliation in render: ',affiliation);
    let stories = this.state.stories;
    switch(affiliation){
      case 'liberal':
      stories = stories.filter((story)=>{
        return story.affiliation == 'liberal';
      });
      break;
      case 'conservative':
      stories = stories.filter((story)=>{
        return story.affiliation == 'conservative';
      });
      break;
      case 'none':
      stories = stories.filter((story)=>{
        return story;
      });
    }
    stories = this.shuffle(stories);
    return(
      <div>
        <div className="outer-wrapper">
            <div className="wrapper">
                <div className="navigation-panel">
                  NAVIGATION
                  <div className="panel panel-default">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque corrupti quo voluptas est, incidunt repudiandae, facilis nisi quam possimus quae beatae blanditiis, repellendus, ducimus placeat totam. Aliquid maiores porro harum?</div>
                  <div className="panel panel-default">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa nihil optio quae sunt possimus fugit doloribus quidem nisi inventore iusto aut, distinctio hic, maxime adipisci facilis illo sint laboriosam exercitationem.</div>
                  <div className="panel panel-default">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis nam sed odit maiores corporis accusantium dignissimos quis consequatur, accusamus et. Sapiente aperiam excepturi, perferendis aliquam cumque amet praesentium quasi adipisci.</div>
                </div>
                <Posts />
              <StoryLinks stories={stories}/>
            </div>
        </div>

        {/* <UserPanel/> */}



    </div>
    )
  }
}

export default Newsfeed;
