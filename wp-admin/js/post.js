var tagBox,commentsBox,editPermalink,makeSlugeditClickable,WPSetThumbnailHTML,WPSetThumbnailID,WPRemoveThumbnail;function array_unique_noempty(b){var c=[];jQuery.each(b,function(a,d){d=jQuery.trim(d);if(d&&jQuery.inArray(d,c)==-1){c.push(d)}});return c}(function(a){tagBox={clean:function(b){return b.replace(/\s*,\s*/g,",").replace(/,+/g,",").replace(/[,\s]+$/,"").replace(/^[,\s]+/,"")},parseTags:function(e){var h=e.id,b=h.split("-check-num-")[1],d=a(e).closest(".tagsdiv"),g=d.find(".the-tags"),c=g.val().split(","),f=[];delete c[b];a.each(c,function(i,j){j=a.trim(j);if(j){f.push(j)}});g.val(this.clean(f.join(",")));this.quickClicks(d);return false},quickClicks:function(c){var e=a(".the-tags",c),d=a(".tagchecklist",c),b;if(!e.length){return}b=e.val().split(",");d.empty();a.each(b,function(h,i){var f,g,j=a(c).attr("id");i=a.trim(i);if(!i.match(/^\s+$/)&&""!=i){g=j+"-check-num-"+h;f='<span><a id="'+g+'" class="ntdelbutton">X</a>&nbsp;'+i+"</span> ";d.append(f);a("#"+g).click(function(){tagBox.parseTags(this)})}})},flushTags:function(e,b,g){b=b||false;var i,c=a(".the-tags",e),h=a("input.newtag",e),d;i=b?a(b).text():h.val();tagsval=c.val();d=tagsval?tagsval+","+i:i;d=this.clean(d);d=array_unique_noempty(d.split(",")).join(",");c.val(d);this.quickClicks(e);if(!b){h.val("")}if("undefined"==typeof(g)){h.focus()}return false},get:function(c){var b=c.substr(c.indexOf("-")+1);a.post(ajaxurl,{action:"get-tagcloud",tax:b},function(e,d){if(0==e||"success"!=d){e=wpAjax.broken}e=a('<p id="tagcloud-'+b+'" class="the-tagcloud">'+e+"</p>");a("a",e).click(function(){tagBox.flushTags(a(this).closest(".inside").children(".tagsdiv"),this);return false});a("#"+c).after(e)})},init:function(){var b=this,c=a("div.ajaxtag");a(".tagsdiv").each(function(){tagBox.quickClicks(this)});a("input.tagadd",c).click(function(){b.flushTags(a(this).closest(".tagsdiv"))});a("div.taghint",c).click(function(){a(this).css("visibility","hidden").siblings(".newtag").focus()});a("input.newtag",c).blur(function(){if(this.value==""){a(this).siblings(".taghint").css("visibility","")}}).focus(function(){a(this).siblings(".taghint").css("visibility","hidden")}).keyup(function(d){if(13==d.which){tagBox.flushTags(a(this).closest(".tagsdiv"));return false}}).keypress(function(d){if(13==d.which){d.preventDefault();return false}}).each(function(){var d=a(this).closest("div.tagsdiv").attr("id");a(this).suggest(ajaxurl+"?action=ajax-tag-search&tax="+d,{delay:500,minchars:2,multiple:true,multipleSep:", "})});a("#post").submit(function(){a("div.tagsdiv").each(function(){tagBox.flushTags(this,false,1)})});a("a.tagcloud-link").click(function(){tagBox.get(a(this).attr("id"));a(this).unbind().click(function(){a(this).siblings(".the-tagcloud").toggle();return false});return false})}};commentsBox={st:0,get:function(d,c){var b=this.st,e;if(!c){c=20}this.st+=c;this.total=d;a("#commentsdiv img.waiting").show();e={action:"get-comments",mode:"single",_ajax_nonce:a("#add_comment_nonce").val(),post_ID:a("#post_ID").val(),start:b,num:c};a.post(ajaxurl,e,function(f){f=wpAjax.parseAjaxResponse(f);a("#commentsdiv .widefat").show();a("#commentsdiv img.waiting").hide();if("object"==typeof f&&f.responses[0]){a("#the-comment-list").append(f.responses[0].data);theList=theExtraList=null;a("a[className*=':']").unbind();setCommentsList();if(commentsBox.st>commentsBox.total){a("#show-comments").hide()}else{a("#show-comments").html(postL10n.showcomm)}return}else{if(1==f){a("#show-comments").parent().html(postL10n.endcomm);return}}a("#the-comment-list").append('<tr><td colspan="2">'+wpAjax.broken+"</td></tr>")});return false}};WPSetThumbnailHTML=function(b){a(".inside","#postimagediv").html(b)};WPSetThumbnailID=function(c){var b=a("input[value=_thumbnail_id]","#list-table");if(b.size()>0){a("#meta\\["+b.attr("id").match(/[0-9]+/)+"\\]\\[value\\]").text(c)}};WPRemoveThumbnail=function(){a.post(ajaxurl,{action:"set-post-thumbnail",post_id:a("#post_ID").val(),thumbnail_id:-1,cookie:encodeURIComponent(document.cookie)},function(b){if(b=="0"){alert(setPostThumbnailL10n.error)}else{WPSetThumbnailHTML(b)}})}})(jQuery);jQuery(document).ready(function(g){var c,a,h="",b="post"==pagenow||"post-new"==pagenow,f="page"==pagenow||"page-new"==pagenow;if(b){type="post";if(typenow){type=typenow}postboxes.add_postbox_toggles(type)}else{if(f){postboxes.add_postbox_toggles("page")}}if(g("#tagsdiv-post_tag").length){tagBox.init()}else{g("#side-sortables, #normal-sortables, #advanced-sortables").children("div.postbox").each(function(){if(this.id.indexOf("tagsdiv-")===0){tagBox.init();return false}})}g(".categorydiv").each(function(){var n=g(this).attr("id"),j=false,m,o,l,i,k;l=n.split("-");l.shift();i=l.join("-");k=i+"_tab";if(i=="category"){k="cats"}g("a","#"+i+"-tabs").click(function(){var p=g(this).attr("href");g(this).parent().addClass("tabs").siblings("li").removeClass("tabs");g("#"+i+"-tabs").siblings(".tabs-panel").hide();g(p).show();if("#"+i+"-all"==p){deleteUserSetting(k)}else{setUserSetting(k,"pop")}return false});if(getUserSetting(k)){g('a[href="#'+i+'-pop"]',"#"+i+"-tabs").click()}g("#new"+i).one("focus",function(){g(this).val("").removeClass("form-input-tip")});g("#"+i+"-add-submit").click(function(){g("#new"+i).focus()});m=function(){if(j){return}j=true;var p=jQuery(this),r=p.is(":checked"),q=p.val().toString();g("#in-"+i+"-"+q+", #in-"+i+"-category-"+q).attr("checked",r);j=false};catAddBefore=function(p){if(!g("#new"+i).val()){return false}p.data+="&"+g(":checked","#"+i+"checklist").serialize();return p};o=function(u,t){var q,p=g("#new"+i+"_parent");if("undefined"!=t.parsed.responses[0]&&(q=t.parsed.responses[0].supplemental.newcat_parent)){p.before(q);p.remove()}};g("#"+i+"checklist").wpList({alt:"",response:i+"-ajax-response",addBefore:catAddBefore,addAfter:o});g("#"+i+"-add-toggle").click(function(){g("#"+i+"-adder").toggleClass("wp-hidden-children");g('a[href="#'+i+'-all"]',"#"+i+"-tabs").click();return false});g("#"+i+"checklist li.popular-category :checkbox, #"+i+"checklist-pop :checkbox").live("click",function(){var p=g(this),r=p.is(":checked"),q=p.val();if(q&&p.parents("#taxonomy-"+i).length){g("#in-"+i+"-"+q+", #in-popular-"+i+"-"+q).attr("checked",r)}})});if(g("#postcustom").length){g("#the-list").wpList({addAfter:function(i,j){g("table#list-table").show();if(typeof(autosave_update_post_ID)!="undefined"){autosave_update_post_ID(j.parsed.responses[0].supplemental.postid)}},addBefore:function(i){i.data+="&post_id="+g("#post_ID").val();return i}})}if(g("#submitdiv").length){c=g("#timestamp").html();a=g("#post-visibility-display").html();function e(){var i=g("#post-visibility-select");if(g("input:radio:checked",i).val()!="public"){g("#sticky").attr("checked",false);g("#sticky-span").hide()}else{g("#sticky-span").show()}if(g("input:radio:checked",i).val()!="password"){g("#password-span").hide()}else{g("#password-span").show()}}function d(){var p,q,j,s,r=g("#post_status"),k=g("option[value=publish]",r),i=g("#aa").val(),n=g("#mm").val(),o=g("#jj").val(),m=g("#hh").val(),l=g("#mn").val();p=new Date(i,n-1,o,m,l);q=new Date(g("#hidden_aa").val(),g("#hidden_mm").val()-1,g("#hidden_jj").val(),g("#hidden_hh").val(),g("#hidden_mn").val());j=new Date(g("#cur_aa").val(),g("#cur_mm").val()-1,g("#cur_jj").val(),g("#cur_hh").val(),g("#cur_mn").val());if(p.getFullYear()!=i||(1+p.getMonth())!=n||p.getDate()!=o||p.getMinutes()!=l){g(".timestamp-wrap","#timestampdiv").addClass("form-invalid");return false}else{g(".timestamp-wrap","#timestampdiv").removeClass("form-invalid")}if(p>j&&g("#original_post_status").val()!="future"){s=postL10n.publishOnFuture;g("#publish").val(postL10n.schedule)}else{if(p<=j&&g("#original_post_status").val()!="publish"){s=postL10n.publishOn;g("#publish").val(postL10n.publish)}else{s=postL10n.publishOnPast;if(f){g("#publish").val(postL10n.updatePage)}else{g("#publish").val(postL10n.updatePost)}}}if(q.toUTCString()==p.toUTCString()){g("#timestamp").html(c)}else{g("#timestamp").html(s+" <b>"+g("option[value="+g("#mm").val()+"]","#mm").text()+" "+o+", "+i+" @ "+m+":"+l+"</b> ")}if(g("input:radio:checked","#post-visibility-select").val()=="private"){if(f){g("#publish").val(postL10n.updatePage)}else{g("#publish").val(postL10n.updatePost)}if(k.length==0){r.append('<option value="publish">'+postL10n.privatelyPublished+"</option>")}else{k.html(postL10n.privatelyPublished)}g("option[value=publish]",r).attr("selected",true);g(".edit-post-status","#misc-publishing-actions").hide()}else{if(g("#original_post_status").val()=="future"||g("#original_post_status").val()=="draft"){if(k.length){k.remove();r.val(g("#hidden_post_status").val())}}else{k.html(postL10n.published)}if(r.is(":hidden")){g(".edit-post-status","#misc-publishing-actions").show()}}g("#post-status-display").html(g("option:selected",r).text());if(g("option:selected",r).val()=="private"||g("option:selected",r).val()=="publish"){g("#save-post").hide()}else{g("#save-post").show();if(g("option:selected",r).val()=="pending"){g("#save-post").show().val(postL10n.savePending)}else{g("#save-post").show().val(postL10n.saveDraft)}}return true}g(".edit-visibility","#visibility").click(function(){if(g("#post-visibility-select").is(":hidden")){e();g("#post-visibility-select").slideDown("normal");g(this).hide()}return false});g(".cancel-post-visibility","#post-visibility-select").click(function(){g("#post-visibility-select").slideUp("normal");g("#visibility-radio-"+g("#hidden-post-visibility").val()).attr("checked",true);g("#post_password").val(g("#hidden_post_password").val());g("#sticky").attr("checked",g("#hidden-post-sticky").attr("checked"));g("#post-visibility-display").html(a);g(".edit-visibility","#visibility").show();d();return false});g(".save-post-visibility","#post-visibility-select").click(function(){var i=g("#post-visibility-select");i.slideUp("normal");g(".edit-visibility","#visibility").show();d();if(g("input:radio:checked",i).val()!="public"){g("#sticky").attr("checked",false)}if(true==g("#sticky").attr("checked")){h="Sticky"}else{h=""}g("#post-visibility-display").html(postL10n[g("input:radio:checked",i).val()+h]);return false});g("input:radio","#post-visibility-select").change(function(){e()});g("#timestampdiv").siblings("a.edit-timestamp").click(function(){if(g("#timestampdiv").is(":hidden")){g("#timestampdiv").slideDown("normal");g(this).hide()}return false});g(".cancel-timestamp","#timestampdiv").click(function(){g("#timestampdiv").slideUp("normal");g("#mm").val(g("#hidden_mm").val());g("#jj").val(g("#hidden_jj").val());g("#aa").val(g("#hidden_aa").val());g("#hh").val(g("#hidden_hh").val());g("#mn").val(g("#hidden_mn").val());g("#timestampdiv").siblings("a.edit-timestamp").show();d();return false});g(".save-timestamp","#timestampdiv").click(function(){if(d()){g("#timestampdiv").slideUp("normal");g("#timestampdiv").siblings("a.edit-timestamp").show()}return false});g("#post-status-select").siblings("a.edit-post-status").click(function(){if(g("#post-status-select").is(":hidden")){g("#post-status-select").slideDown("normal");g(this).hide()}return false});g(".save-post-status","#post-status-select").click(function(){g("#post-status-select").slideUp("normal");g("#post-status-select").siblings("a.edit-post-status").show();d();return false});g(".cancel-post-status","#post-status-select").click(function(){g("#post-status-select").slideUp("normal");g("#post_status").val(g("#hidden_post_status").val());g("#post-status-select").siblings("a.edit-post-status").show();d();return false})}if(g("#edit-slug-box").length){editPermalink=function(j){var k,n=0,m=g("#editable-post-name"),o=m.html(),r=g("#post_name"),s=r.html(),p=g("#edit-slug-buttons"),q=p.html(),l=g("#editable-post-name-full").html();g("#view-post-btn").hide();p.html('<a href="#" class="save button">'+postL10n.ok+'</a> <a class="cancel" href="#">'+postL10n.cancel+"</a>");p.children(".save").click(function(){var i=m.children("input").val();g.post(ajaxurl,{action:"sample-permalink",post_id:j,new_slug:i,new_title:g("#title").val(),samplepermalinknonce:g("#samplepermalinknonce").val()},function(t){g("#edit-slug-box").html(t);p.html(q);r.attr("value",i);makeSlugeditClickable();g("#view-post-btn").show()});return false});g(".cancel","#edit-slug-buttons").click(function(){g("#view-post-btn").show();m.html(o);p.html(q);r.attr("value",s);return false});for(k=0;k<l.length;++k){if("%"==l.charAt(k)){n++}}slug_value=(n>l.length/4)?"":l;m.html('<input type="text" id="new-post-slug" value="'+slug_value+'" />').children("input").keypress(function(t){var i=t.keyCode||0;if(13==i){p.children(".save").click();return false}if(27==i){p.children(".cancel").click();return false}r.attr("value",this.value)}).focus()};makeSlugeditClickable=function(){g("#editable-post-name").click(function(){g("#edit-slug-buttons").children(".edit-slug").click()})};makeSlugeditClickable()}});