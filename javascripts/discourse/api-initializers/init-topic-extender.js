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
      api.reopenWidget("post-meta-data", {
      tagName: "div.topic-meta-data",

      buildAttributes() {
        return {
          role: "heading",
          "aria-level": "2",
        };
      },

      settings: {
        displayPosterName: true,
      },

      html(attrs) {

        if(debug){ 
          console.log('overriding');
        }

        let postInfo = [];

        if (attrs.isWhisper) {
          postInfo.push(
            h(
              "div.post-info.whisper",
              {
                attributes: { title: I18n.t("post.whisper") },
              },
              iconNode("far-eye-slash")
            )
          );
        }

        if (attrs.via_email) {
          postInfo.push(this.attach("post-email-indicator", attrs));
        }

        if (attrs.locked) {
          postInfo.push(this.attach("post-locked-indicator", attrs));
        }

        if (attrs.version > 1 || attrs.wiki) {
          postInfo.push(this.attach("post-edits-indicator", attrs));
        }

        if (attrs.multiSelect) {
          postInfo.push(this.attach("select-post", attrs));
        }

        if (showReplyTab(attrs, this.siteSettings)) {
          postInfo.push(this.attach("reply-to-tab", attrs));
        }

        postInfo.push(this.attach("post-date", attrs));

        postInfo.push(
          h(
            "div.read-state",
            {
              className: attrs.read ? "read" : null,
              attributes: {
                title: I18n.t("post.unread"),
              },
            },
            iconNode("circle")
          )
        );

        let result = [];
        if (this.settings.displayPosterName) {
          result.push(this.attach("poster-name", attrs));
        }
        result.push(h("div.post-infos", postInfo));

        return result;
      },
    });
    }

  }  

});

