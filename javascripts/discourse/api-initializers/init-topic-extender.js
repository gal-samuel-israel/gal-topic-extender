import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {

  var blockThisPlugin;  

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

    var showOnlyToAdmins = settings.enable_modal_only_for_admins; //make this false to enable component all users
    var isAdmin = (currentUser.admin)        
    blockThisPlugin = (showOnlyToAdmins && !isAdmin);

    if(debug){          
      console.log('topic-extender initializer:');      
      console.log('admin: ', currentUser.admin); 
      console.log('id: ', currentUser.id); 
      console.log('blocked: ', blockThisPlugin); 
    }

    if(!blockThisPlugin){

      api.reopenWidget("poster-name", {
        html(attrs) {
            if(debug){
              console.log('attrs: ',attrs);
            }
            return this._super(attrs);          
        }
      });
    }

  }  

});

