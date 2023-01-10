import { apiInitializer } from "discourse/lib/api";
import { applyDecorators } from "discourse/widgets/widget";

export default apiInitializer("0.8", (api) => {

  var blockModal;  

  if (api.getCurrentUser()) {
    const currentUser = api.getCurrentUser()

    var debug = currentUser.admin && settings.enable_debug_for_admins;
    var debugForUsers = settings.enable_debug_for_user_ids;
    var debugForIDs = (debugForUsers) ? debugForUsers.split("|") : null;
    if (debugForIDs && debugForIDs.includes(currentUser.id.toString())) {
      debug = true;
    }

    var debug4All = settings.enable_debug_for_all;
    if(debug4All){ debug = true; }
    
    //const user = container.lookup("service:current-user");

    if(debug){          
      console.log('topic-extender initializer:');
      //console.log(user);
      //console.log(currentUser.user_option);
      console.log('admin: ' + currentUser.admin); 
      console.log('id: ' + currentUser.id); 
    }

    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    blockModal = (showOnlyToAdmins && !isAdmin);

    if(!blockModal){
      api.reopenWidget("post-body", {
        tagName: "div.topic-body.clearfix",

        html(attrs, state) {
          console.log('overridden');
          
          const postContents = this.attach("post-contents", attrs);
          let result = [this.attach("post-meta-data", attrs)];
          result = result.concat(
            applyDecorators(this, "after-meta-data", attrs, state)
          );
          result.push(postContents);
          result.push(this.attach("actions-summary", attrs));
          result.push(this.attach("post-links", attrs));
          if (attrs.showTopicMap) {
            result.push(this.attach("topic-map", attrs));
          }

          return result;
        },
      });
    }

  }  

});

