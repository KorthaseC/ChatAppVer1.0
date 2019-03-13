const app=require("express")();
const http=require("http").Server(app);
const port= process.env.PORT || 3000;
const io = require("socket.io")(http); // zum Starten von Socket.io auf dem Server

// using express to serve up a static index.html file to the browser whenever it detects a GET request at the root (/), 
// and then telling our server to listen to the port we defined.
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/chat.css", function(req, res){
  res.sendFile(__dirname + "/chat.css");
});

app.get("/chat.js", function(req, res){
  res.sendFile(__dirname + "/chat.js");
});

http.listen(port, function(){
  console.log("Listening on *: " +port);
});

//fügt Listner an jedes Event das ankommenden Sockets hinzu, bzw. wenn das socket verbunden ist sind das die Event die abgehört werden
io.on("connection", function(socket){
  
  socket.on ("user_join", function(data){
    this.username=data;
    socket.broadcast.emit("user_join", data); //Event: user_join 1. gesetzt im socket und dann broadcastet zurück zu anderen teilnehmenern 
  });

  socket.on("chat_message", function(data){
    data.username=this.username;
    socket.broadcast.emit("chat_message", data); //fügt den username an und gibt ihn als neue Nachricht zurück
  });

  socket.on("disconnect", function(data){
    socket.broadcast.emit("user_leave", this.username); //gibt zurück wenn jemand den Chat verlässt
  });
});

