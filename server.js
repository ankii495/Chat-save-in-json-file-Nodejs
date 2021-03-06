const https = require('http');
const io = require('socket.io')()
var rand = require('random-number-between')
var fs = require('fs');

io.on('connection', (client)=>{
    client.on('getMessage', (msg)=>{
		
		
		 //Code for writing to the json file.
		 var objHash = {
          questions: []
        };
		objHash.questions.push(msg);
		var json = JSON.stringify(objHash);//convert to string
		//Append to the file the content that is coming.
        fs.appendFile('questions.json', json, 'utf8', (err) => {
          console.log(err ? 'no access!' : 'can read/write');
        });
        
		
		
        index=[]
        if(msg === 'no')
            index[0] = 7
		
        else
            index = rand(0, 6, 1)
        
        https.get('http://127.0.0.1:5004/sign_users'+'?name='+msg, (resp) => {
		  let data = '';
		 
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
		    data += chunk;
		  });

		 resp.on('end', () => {
		    client.emit('message', data);
		  });
		 
		 }).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
    });
	
	 client.on('new user', function(data,callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            client.username = data;
            usernames.push(client.username);
            updateUsernames();
        }
    });

    //update username
    function updateUsernames(){
        io.sockets.emit('usernames', usernames);
    }

    //Send message
    client.on('send message', function(data){
        io.sockets.emit('new message',{msg:data, user:client.username});
    });

    //Disconnect
    client.on('disconnect',function(data){
         if(!client.usernames){
             return;
         }

         usernames.splice(usernames.indexOf(client.username, 1));
         updateUsernames();
    });
})

const port = 8000;
io.listen(port);
console.log('listening on port ', port);