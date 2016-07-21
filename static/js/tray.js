var onload=(function(){
	var chats,chatids=[],user
	function showchatmessages(id){
		id=id.split('/')
		console.log(id);
		$.ajax({
			url:"chat/get_chatroom_messages",
			type:"POST",
			data:{pk:id[2],type:id[1]},
			success:function(json){
				console.log(json)
				$("#chat").html("")
				for (var i =0 ;i<json.length;i++) {
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
						sometext="ag message\" id=\"msg/"+s["type"]+"/"+s["pk"]+"\">"+sometext
					}
					else
					{
						sometext=" message\" id=\"msg/"+s["type"]+"/"+s["pk"]+"\">"+sometext
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
			},
		}).done(function(){
			$(".message").click(function(e){
				e.preventDefault();
				console.log("hi")
 			});
		});
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
		        		text+="<li class=\"collection-item avatar chats\" id=\""
		        		str="chat/"+c["type"]+"/"+c["pk"]
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
		        		text+="<li class=\"collection-item avatar  chats\" id=\""
		        		str="chat/"+c["type"]+"/"+c["pk"]
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
	function init(){
		showchats();
		get_useritself();
	}
	return {
		init:init
	}
})();