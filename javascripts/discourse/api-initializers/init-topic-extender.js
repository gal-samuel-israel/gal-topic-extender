import { apiInitializer } from "discourse/lib/api";
import { iconNode } from "discourse-common/lib/icon-library";
import I18n from "I18n";

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

      function showReplyTab(attrs, siteSettings) {
        return (
          attrs.replyToUsername &&
          (!attrs.replyDirectlyAbove || !siteSettings.suppress_reply_directly_above)
        );
      }

      api.reopenWidget("poster-name", {
        html(attrs) {          
              return this._super(attrs);          
        }
      });
    }

  }  

});

