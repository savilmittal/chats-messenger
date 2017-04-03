var onload=(function(){
	var chats={},chatids=[],chatmessages={},user,presentchatid="0",messageflag=1,userflag=1,groupflag=1,userformval="Enter a username",groupformval="Enter Group Name",addingchatmessagesbeforenotificationcall=1;
	var grouproomflag=1,grouproomformval="Enter a username",datestart
	function showchatmessageswrapper(json,id,len){
		id=id.split('x1x2x3x4')
		var wer="/"+id[3]
				//console.log(chatmessages[presentchatid])
				$("#chatheaderpic").attr("src",wer)
				wer="<strong><b>"+id[4]+"<br></b></strong></span>Notification"
				$("#chatheaderhtml").html(wer)
				for (var i =len ;i<json.length;i++) {
					var s=json[i]
					var c=s["created_by"]
					var sometext
					if((i>0&&json[i].created_by.pk==json[i-1].created_by.pk)||c["pk"]==user["pk"]||s["type"])
					{

						sometext="<p style=\"margin: 0px auto;word-wrap: break-word;\">"
					}
					else
					{
						sometext="<p style=\"margin: 0px auto;word-wrap: break-word;\">"
						sometext+="<span><strong><b>"
						sometext+=c["username"]
						sometext+="<br></b></strong></span>"
					}
					if(i>0&&json[i].created_by.pk==json[i-1].created_by.pk)
					{
						sometext="ag message\" id=\"msgx1x2x3x4"+s["type"]+"x1x2x3x4"+s["pk"]+"\">"+sometext
					}
					else
					{
						sometext=" message\" id=\"msgx1x2x3x4"+s["type"]+"x1x2x3x4"+s["pk"]+"\">"+sometext
					}
					sometext+=s["text"]
					var text
					if(c["pk"]==user["pk"])
					{
						text="<li class=\"speechright"+sometext
					}
					else
					{
						text="<li class=\"speechleft"+sometext
					}
					text+="</p></li>"
					$("#chat").append(text);

				}
				dontshowsinglechatdrop();
				$("#chat").scrollTop($("#chat")[0].scrollHeight);
				if(json.length==0)
				{

				}
	}
	function showchatmessages(id){
		aid=id
		$("#default").hide();
		$("#room").show();
		if(addingchatmessagesbeforenotificationcall==1)
		presentchatid=id
		id=id.split('x1x2x3x4')
		//console.log(chatmessages[presentchatid]);
		if(addingchatmessagesbeforenotificationcall==1&&chatmessages[presentchatid])
		{
			$("#chat").html("")
			showchatmessageswrapper(chatmessages[presentchatid],presentchatid,0);
			$(".message").click(function(e){
				e.preventDefault();
				//console.log("hi")
 			});
		}
		else
		{
			$.ajax({
			url:"/chat/get_chatroom_messages",
			type:"POST",
			data:{pk:id[2],type:id[1]},
			success:function(json){
				//console.log(json)
				if(addingchatmessagesbeforenotificationcall==1)
				chatmessages[presentchatid]=json
				else
				chatmessages[aid]=json
				$("#chat").html("")
				if(addingchatmessagesbeforenotificationcall==1)
				showchatmessageswrapper(json,presentchatid,0);
				addingchatmessagesbeforenotificationcall=1;
			},
		}).done(function(){
			$(".message").click(function(e){
				e.preventDefault();
				//console.log("hi")
 			});
		});
	}

}
	function showchats(){
		$.ajax({
		    url : "/chat/get_chats", // the endpoint
		    type : "POST", // http method/
		    success : function(json) {
		    	data=json["list"]
		    	datestart=json["lastnotification"]
		    	json=data
		        //console.log(data); // log the returned json to the console
		        for(x=0;x<data.length;x++)
		        {
		        	var c=data[x]
		        	var text=""
		        	var str=""
		        	if(c["type"]==1)
		        	{
		        		var vc=c.user
		        		//console.log(vc)
		        		text+="<li class=\"collection-item avatar chats menu_links\" id=\""
		        		str="chatx1x2x3x4"+c["type"]+"x1x2x3x4"+c["pk"]+"x1x2x3x4"+vc["profilepic"]+"x1x2x3x4"+vc["username"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=vc["profilepic"]
		        		text+="\"class=\"circle \"><span class=\"title\"><strong><b>"
		        		text+=vc["username"]
						text+="</b></strong></span><p class=\"truncate lastmessage\">"
						text+=c["message"]
		        		text+="</p></li>"
		        	}
		        	else
		        	{
		        		text+="<li class=\"collection-item avatar  chats menu_links\" id=\""
		        		str="chatx1x2x3x4"+c["type"]+"x1x2x3x4"+c["pk"]+"x1x2x3x4"+c["icon"]+"x1x2x3x4"+c["title"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=c["icon"]
		        		text+="\"class=\"circle\"><span class=\"title\"><strong><b>"
		        		text+=c["title"]
		        		text+="</b></strong></span><p class=\"truncate lastmessage\">"
		        		text+=c["message"]						
		        		text+="</p></li>"
		        	}
		        	//console.log(text)

		        	$("#tray").append(text);
		        	chats[str]=data[x]
		        	str='#'+str
		        	chatids.push(str)
		        	//console.log(str)
		        }
		        //console.log("success"); // another sanity check
		        //console.log("hi")
		    },

	    	}).done(function(data){
	    			notification(); 
	   				$(".chats").click(function(e){
	   					e.preventDefault();
	   					var x=this.id
	   					console.log(x)
	   					$("#messagebox").html("");
        				$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");
			       		showchatmessages(x);
 					});
	   	});

	}
	function get_useritself(){
		$.ajax({
			url:"/chat/get_useritself",
			type:"POST",
			success:function(json){
				//console.log(json)
				user=json

			},
		}).done(function(){
			$("#trayheaderpic").attr("src","/"+user.profilepic);
			//console.log(user.username)
			var text="<strong><b>Hi,"+user.username+"<br></b></strong></span>"
			//console.log(text)
			$("#trayheaderhtml").html(text);
		});
	}
	function save_message(text){
		//console.log(text);
		var chatid=presentchatid
		chatid=chatid.split('x1x2x3x4');
		var trayid=presentchatid
		var x="\/"
		x=x.split("/");
		x=x[0]
		trayid=trayid.split('/');
		//trayid=trayid[0]+x+x+"/"+trayid[1]+x+x+"/"+trayid[2]
		trayidd=trayid[2].split('.');
		//trayid=trayid[0]+x+x+"."+trayid[1]
		//console.log(trayid);
		$("#"+trayid[0]+"\\/"+trayid[1]+"\\/"+trayidd[0]+"\\."+trayidd[1]+" p").text(text);
		console.log(text);

		var publickey;

		//get public key
		if(chatid[1]=='1')
		{
			$.ajax({
			url:"/chat/publickey",
			type:"GET",
			data:{pk:chatid[2]},
			success:function(json){
				
 					publickey=json.key;
				},
			}).done(function(){
				//encryption starts
				var encrypt = new JSEncrypt();
		        encrypt.setPublicKey(publickey);
		        console.log(publickey);
		        var encrypted = encrypt.encrypt(text);
				console.log(encrypted);
				text=encrypted;
				//encryption ends
				$.ajax({
					url:"/message/save_message",
					type:"POST",
					data:{pk:chatid[2],type:chatid[1],message:text},
					success:function(json){
					//console.log(json)
					chatmessages[presentchatid].push(json);
					showchatmessageswrapper(chatmessages[presentchatid],presentchatid,chatmessages[presentchatid].length-1);
					$(".message").click(function(e){
					e.preventDefault();
					//console.log("hi")
		 				});
					},
				});
			});

		}
		else
		{
			$.ajax({
					url:"/message/save_message",
					type:"POST",
					data:{pk:chatid[2],type:chatid[1],message:text},
					success:function(json){
					//console.log(json)
					chatmessages[presentchatid].push(json);
					showchatmessageswrapper(chatmessages[presentchatid],presentchatid,chatmessages[presentchatid].length-1);
					$(".message").click(function(e){
					e.preventDefault();
					//console.log("hi")
 						});
					},
				});
			
		}
		
		
	}
	function post_message(){
		$("#messagebox").keypress(function(e){
			if(messageflag==1)
			{
				$("#messagebox").html("");
				messageflag=0;
			}
			if(e.which == 13) {
				e.preventDefault();
				var text=$(this).html();
		        if(text!="")
		        {
		        	save_message(text);
		        }
		        messageflag=1;
        		$("#messagebox").html("");
        		$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");
		    }
		});
		$("#messagesend").click(function(e){
			if(messageflag==1)
			{
				$("#messagebox").html("");
			}
			else
			{
				e.preventDefault();
				var text=$("#messagebox").html();
		        if(text!=""&&text!="<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>")
		        {
		        	save_message(text);
		        }
		        messageflag=1;
        		$("#messagebox").html("");
        		$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");

			}

		});
		$("#messagebox").click(function(e){
			if(messageflag==1)
			{
				$("#messagebox").html("");
				messageflag=0;
			}
		});
	}
	function showdropdown(){
		$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 0,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 20, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right' // Displays dropdown with edge aligned to the left of button
    }
  );
	}
	function save_singlechat(text){
		var flag=1;
		for (var i = chatids.length - 1; i >= 0; i--) {
			var x=chatids[i]
			x=x.split('x1x2x3x4');
			//console.log(x[4]);
			if(x[4]==text&&x[1]==1){
				flag=0;
				userformval="User already existing in your chats";
				break;
			}
		}
		if(flag){
			userformval="Adding to chats..."
			$.ajax({
				url:"/chat/create_singlechat",
				type:"POST",
				data:{username:text},
				success:function(json){
					//console.log(json)
					userformval=json["form"].messageform;
					//console.log("hi")
					var c=json["chat"]
		        	var text=""
		        	var str=""
		        	if(c["type"]==1)
		        	{
		        		var vc=c.user
		        		//console.log(vc)
		        		text+="<li class=\"collection-item avatar chats menu_links\" id=\""
		        		str="chatx1x2x3x4"+c["type"]+"x1x2x3x4"+c["pk"]+"x1x2x3x4"+vc["profilepic"]+"x1x2x3x4"+vc["username"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=vc["profilepic"]
		        		text+="\"class=\"circle \"><span class=\"title\"><strong><b>"
		        		text+=vc["username"]
						text+="</b></strong></span><p class=\"truncate lastmessage\">"
						text+=c["message"]
		        		text+="</p></li>"
		        		$("#tray").prepend(text);
			        	chats[str]=data[x]
			        	str='#'+str
			        	chatids.push(str)
			        	//console.log(str)
		        	}
				},
			}).done(function(){
        		$("#userbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+userformval+"<strong>");
				userformval="Enter a username";
				$(".chats").click(function(e){
	   					e.preventDefault();
	   					var x=this.id
	   					//console.log(x)
	   					$("#messagebox").html("");
        				$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");
			       		showchatmessages(x);
 					});

			});
		}
	}
	function addchatuser(){
		$("#userbox").keypress(function(e){
			if(userflag==1)
			{
				$("#userbox").html("");
				userflag=0;
			}
			if(e.which == 13) {
				e.preventDefault();
				var text=$(this).html();
				//console.log(text)
		        if(text!="")
		        {
		        	save_singlechat(text);
		        }
		        userflag=1;
        		$("#userbox").html("");
        		$("#userbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+userformval+"<strong>");
        		userformval="Enter a username";
		    }
		});
		$("#usersend").click(function(e){
			if(userflag==1)
			{
				$("#userbox").html("");
			}
			else
			{
	        	e.preventDefault();
				var text=$("#userbox").html();
				//console.log("hanji"+text);
		        if(text!="")
		        {
		        	save_singlechat(text);
		        }
		        userflag=1;
        		$("#userbox").html("");
        		$("#userbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+userformval+"<strong>");
        		userformval="Enter a username";
        	}

		});
		$("#userbox").click(function(e){
			if(userflag==1)
			{
				$("#userbox").html("");
				userflag=0;
			}
		});
	}
	function save_groupchat(text){
			groupformval="Adding to chats..."
			$.ajax({
				url:"/chat/create_groupchat",
				type:"GET",
				data:{title:text},
				success:function(json){
					//console.log(json)
					groupformval=json["form"].messageform;
					//console.log("hi")
					var c=json["chat"]
		        	var text=""
		        	var str=""
		        	if(c["type"]==0)
		        	{
		        		text+="<li class=\"collection-item avatar  chats menu_links\" id=\""
		        		str="chatx1x2x3x4"+c["type"]+"x1x2x3x4"+c["pk"]+"x1x2x3x4"+c["icon"]+"x1x2x3x4"+c["title"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=c["icon"]
		        		text+="\"class=\"circle\"><span class=\"title\"><strong><b>"
		        		text+=c["title"]
		        		text+="</b></strong></span><p class=\"truncate lastmessage\">"
		        		text+=c["message"]						
		        		text+="</p></li>"
		        		$("#tray").prepend(text);
			        	chats[str]=data[x]
			        	str='#'+str
			        	chatids.push(str)
			        	//console.log(str)
		        	}
				},
			}).done(function(){
        		$("#groupbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+groupformval+"<strong>");
				groupformval="Enter Group Name";
				$(".chats").click(function(e){
	   					e.preventDefault();
	   					var x=this.id
	   					//console.log(x)
	   					$("#messagebox").html("");
        				$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");
			       		showchatmessages(x);
 					});

			});
	}
		function addgroup(){
			$("#groupbox").keypress(function(e){
			if(groupflag==1)
			{
				$("#groupbox").html("");
				groupflag=0;
			}
			if(e.which == 13) {
				e.preventDefault();
				var text=$(this).html();
		        if(text!="")
		        {
		        	save_groupchat(text);
		        }
		        groupflag=1;
        		$("#groupbox").html("");
        		$("#groupbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+groupformval+"<strong>");
        		groupformval="Enter Group Name";
		    }
		});
		$("#groupsend").click(function(e){
			if(groupflag==1)
			{
				$("#groupbox").html("");
			}
			else
			{
	        	e.preventDefault();
				var text=$("#groupbox").html();
				//console.log("hanjikihalchal"+text);
		        if(text!="")
		        {
		        	save_groupchat(text);
		        }
		        groupflag=1;
        		$("#groupbox").html("");
        		$("#groupbox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+groupformval+"<strong>");
        		groupformval="Enter Group Name";
        	}
		});
		$("#groupbox").click(function(e){
			if(groupflag==1)
			{
				$("#groupbox").html("");
				groupflag=0;
			}
		});	
	}
		function hall(){
			$(".hallex").hide();
			$("#hallel").click(function(){
				$("#trayel").hide();
				$("#halladdnewchat").show();
			});
			$("#halldropgroup").click(function(){
				$("#trayel").hide();
				$("#hallgroup").show();
			});
			$(".hallexit").click(function(){
				$(".hallex").hide();
				$("#trayel").show();
			});
		}
		function dontshowsinglechatdrop(){
			if(presentchatid=='0'){
				return;
			}
			var x=presentchatid
			x=x.split('x1x2x3x4')
			if(x[1]=='1')
			{
				$(".dropgroup").hide();
			}
			else
			{
				$(".dropgroup").show();
			}
		}
		function chatexitgroup(){
			var ide=presentchatid
			ide=ide.split('x1x2x3x4');
			ide=ide[2];
			$.ajax({
				url:"/chat/exit_groupchat",
				type:"GET",
				data:{chatpk:ide},
				success:function(json){
					//console.log(json)
				},
			}).done(function(){
					var trayid=presentchatid
					var x="\/"
					x=x.split("/");
					x=x[0]
					trayid=trayid.split('/');
					//trayid=trayid[0]+x+x+"/"+trayid[1]+x+x+"/"+trayid[2]
					trayidd=trayid[2].split('.');
					//trayid=trayid[0]+x+x+"."+trayid[1]
					//console.log(trayid);
					$("#"+trayid[0]+"\\/"+trayid[1]+"\\/"+trayidd[0]+"\\."+trayidd[1]).remove();
					delete chats[presentchatid];
					presentchatid=0;
			});
		}
		function grouproomchat(){
			$(".grouproomex").hide();
			$("#chataddmember").click(function(){
				$("#room").hide();
				$("#addmember").show();
			});
			$("#chatexitgroup").click(function(){
				chatexitgroup();
			});
			$(".grouproomexit").click(function(){
				$(".grouproomex").hide();
				$("#room").show();
			});
		}
		function save_grouproomaddmember(text){
		var flag=1;
		var ide=presentchatid
		ide=ide.split('x1x2x3x4');
		ide=ide[2];
		for (var i = chatids.length - 1; i >= 0; i--) {
			var x=chatids[i]
			x=x.split('x1x2x3x4');
			console.log(x[4]);
			if(x[4]==text&&x[1]==1){
				flag=0;
				break;
			}
		}
		//console.log(flag);
		if(flag==0){
			grouproomformval="Adding to group..."
			$.ajax({
				url:"/chat/add_groupchat",
				type:"GET",
				data:{username:text,chatpk:ide},
				success:function(json){
					//console.log(json)
					grouproomformval=json.messageform;
				},
			}).done(function(){
        		$("#grouproombox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+grouproomformval+"<strong>");
				grouproomformval="Enter a username";
			});
		}
		else
		{
			grouproomformval="User doesn't exsist in your chats";
		}
	}
	function grouproomaddmember(){
		$("#grouproombox").keypress(function(e){
			if(grouproomflag==1)
			{
				$("#grouproombox").html("");
				grouproomflag=0;
			}
			if(e.which == 13) {
				e.preventDefault();
				var text=$(this).html();
				//console.log(text)
		        if(text!="")
		        {
		        	save_grouproomaddmember(text);	
		    	}
		        grouproomflag=1;
        		$("#grouproombox").html("");
        		$("#grouproombox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+grouproomformval+"<strong>");
        		grouproomformval="Enter a username";
		    }
		});
		$("#grouproomsend").click(function(e){
			if(grouproomflag==1)
			{
				$("#grouproombox").html("");
			}
			else
			{
	        	e.preventDefault();
				var text=$("#grouproombox").html();
		        if(text!="")
		        {
		        	save_grouproomaddmember(text);
		        	//console.log("hanji"+text);
		        }
		        grouproomflag=1;
        		$("#grouproombox").html("");
        		$("#grouproombox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">"+grouproomformval+"<strong>");
        		grouproomformval="Enter a username";
        	}
		});
		$("#grouproombox").click(function(e){
			if(grouproomflag==1)
			{
				$("#grouproombox").html("");
				grouproomflag=0;
			}
		});
	}
		function notification(){
			//console.log(datestart)
			$.ajax({
				url:"/chat/notifications/",
				type:"GET",
				data:{laststamp:""+datestart},
				success:function(json){
					//console.log(json)
					datestart=json["lastnotification"]
					data=json["list"]
					for (var i = data.length - 1; i >= 0; i--) {
						var x=data[i]
						var pid=x["id"]
						var mess=x["messages"]
						//console.log(mess.length)
						if(mess.length>0){
							for (var j = 0; j < mess.length; j++) {
								//console.log(mess[j]);
								//console.log(pid)
								//console.log(presentchatid)
								//console.log(chatmessages[pid])
								if(chatmessages[pid])
								{
									chatmessages[pid].push(mess[j]);
									if(pid==presentchatid)
									{
										showchatmessageswrapper(chatmessages[presentchatid],presentchatid,chatmessages[presentchatid].length-1);
									}
								}
								else
								{
									addingchatmessagesbeforenotificationcall=0;
									showchatmessages(pid);
									if(pid==presentchatid)
									{
										showchatmessageswrapper(chatmessages[presentchatid],presentchatid,0);
									}
									break;
								}
							}
						}
					}
				},
			}).done(function(){
        		setTimeout(notification,5000);
			});
		}
		function defau()
		{
			$("#room").hide();
		}
		function init(){
		showdropdown();
		showchats();
		defau();
		get_useritself();
		post_message();
		addchatuser();
		hall();
		addgroup();
		dontshowsinglechatdrop();
		grouproomchat();
		grouproomaddmember();
	}
	return {
		init:init
	}
})();