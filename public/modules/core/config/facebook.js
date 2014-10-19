'use strict';


window.fbAsyncInit = function() {
    FB.init({
      appId      : '351073508400675',
      xfbml      : true,
      version    : 'v2.1'
    });

    FB.login(function(){
        FB.api('/me/feed', 'post', {message: 'Hey guys! I just posted a quiz on quiztructor online quiz app'});
      }, {
        scope: 'publish_actions'
      });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = '//connect.facebook.net/en_US/sdk.js';
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
