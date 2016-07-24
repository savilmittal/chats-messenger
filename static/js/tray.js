var onload=(function(){
	var chats,chatids=[],chatmessages={},user,presentchatid,messageflag=1
	function showchatmessageswrapper(json,id,len){
		id=id.split('||')
		var wer="/"+id[3]
				console.log(chatmessages[presentchatid])
				$("#chatheaderpic").attr("src",wer)
				wer="<strong><b>"+id[4]+"<br></b></strong></span>Notification"
				$("#chatheaderhtml").html(wer)
				for (var i =len ;i<json.length;i++) {
					var s=json[i]
					var c=s["created_by"]
					var sometext
					if((i>0&&json[i].created_by.pk==json[i-1].created_by.pk)||c["pk"]==user["pk"]||s["type"])
					{

						sometext="<p style=\"margin: 0px auto;\">"
					}
					else
					{
						sometext="<p style=\"margin: 0px auto;\">"
						sometext+="<span><strong><b>"
						sometext+=c["username"]
						sometext+="<br></b></strong></span>"
					}
					if(i>0&&json[i].created_by.pk==json[i-1].created_by.pk)
					{
						sometext="ag message\" id=\"msg||"+s["type"]+"||"+s["pk"]+"\">"+sometext
					}
					else
					{
						sometext=" message\" id=\"msg||"+s["type"]+"||"+s["pk"]+"\">"+sometext
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
				if(json.length==0)
				{

				}
	}
	function showchatmessages(id){
		presentchatid=id
		id=id.split('||')
		console.log(chatmessages[id]);
		if(chatmessages[id])
		{
			$("#chat").html("")
			showchatmessageswrapper(chatmessages[presentchatid],presentchatid,0);
			$(".message").click(function(e){
				e.preventDefault();
				console.log("hi")
 			});
		}
		else
		{
			$.ajax({
			url:"chat/get_chatroom_messages",
			type:"POST",
			data:{pk:id[2],type:id[1]},
			success:function(json){
				console.log(json)
				chatmessages[presentchatid]=json
				$("#chat").html("")
				showchatmessageswrapper(json,presentchatid,0);
			},
		}).done(function(){
			$(".message").click(function(e){
				e.preventDefault();
				console.log("hi")
 			});
		});
	}

}
	function showchats(){
		$.ajax({
		    url : "chat/get_chats", // the endpoint
		    type : "POST", // http method/
		    success : function(json) {
		    	chats=json
		        console.log(chats); // log the returned json to the console
		        for(x=0;x<chats.length;x++)
		        {
		        	var c=chats[x]
		        	var text=""
		        	var str=""
		        	if(c["type"]==1)
		        	{
		        		var vc=c.user
		        		console.log(vc)
		        		text+="<li class=\"collection-item avatar chats menu_links\" id=\""
		        		str="chat||"+c["type"]+"||"+c["pk"]+"||"+vc["profilepic"]+"||"+vc["username"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=vc["profilepic"]
		        		text+="\"class=\"circle \"><span class=\"title\"><strong><b>"
		        		text+=vc["username"]
						text+="</b></strong></span><p>"
						text+=c["message"]
		        		text+="</p></li>"
		        	}
		        	else
		        	{
		        		text+="<li class=\"collection-item avatar  chats menu_links\" id=\""
		        		str="chat||"+c["type"]+"||"+c["pk"]+"||"+c["icon"]+"||"+c["title"]
		        		text+=str
		        		text+="\"><img src=\"/"
		        		text+=c["icon"]
		        		text+="\"class=\"circle\"><span class=\"title\"><strong><b>"
		        		text+=c["title"]
		        		text+="</b></strong></span><p>"
		        		text+=c["message"]						
		        		text+="</p></li>"
		        	}
		        	console.log(text)

		        	$("#tray").append(text);
		        	str='#'+str
		        	chatids.push(str)
		        	console.log(str)
		        }
		        console.log("success"); // another sanity check
		        console.log("hi")
		    },

	    	}).done(function(data){
	   				$(".chats").click(function(e){
	   					e.preventDefault();
	   					var x=this.id
	   					console.log(x)
			       		showchatmessages(x);
 					});
	   	});

	}
	function get_useritself(){
		$.ajax({
			url:"chat/get_useritself",
			type:"POST",
			success:function(json){
				console.log(json)
				user=json
			},
		});
	}
	function save_message(text){
		console.log(text);
		var chatid=presentchatid
		chatid=chatid.split('||');
		$.ajax({
			url:"message/save_message",
			type:"POST",
			data:{pk:chatid[2],type:chatid[1],message:text},
			success:function(json){
				console.log(json)
				chatmessages[presentchatid].push(json);
				showchatmessageswrapper(chatmessages[presentchatid],presentchatid,chatmessages[presentchatid].length-1);
				$(".message").click(function(e){
				e.preventDefault();
				console.log("hi")
 				});
			},
		});
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
				messageflag=0;
			}
	        e.preventDefault();
				var text=$("#messagebox").html();
		        if(text!="")
		        {
		        	save_message(text);
		        }
		        messageflag=1;
        		$("#messagebox").html("");
        		$("#messagebox").html("<strong style=\"color: rgba(30, 37, 35, 0.45);\">Write Something...<strong>");

		});
		$("#messagebox").click(function(e){
			$("#messagebox").html("");
			messageflag=1;
		});
	}
	function init(){
		showchats();
		get_useritself();
		post_message();
	}
	return {
		init:init
	}
})();