const form = document.querySelector("form"); //suche nach dem ersten Element Form
const input=document.querySelector(".input"); //suche nach dem ersten Element input
const messages=document.querySelector(".messages"); //suche nach dem ersten Element messages
const username = prompt("Please enter a username: ", ""); //frage nach dem Usernamen
const socket = io();

form.addEventListener("submit", function(event){ 
  event.preventDefault();   //verhindern das form ausgeführt wird

  addMessage(username + ": " + input.value); //aufruf der addMessage Funktion

  socket.emit("chat_message", {
    message: input.value      //Senden der Nachricht
  });
  
  input.value="";   //zurücksetzen des Wertes für die nächste Nachricht
  return false;
}, false);

socket.on("chat_message", function(data){
  addMessage(data.username + ": " + data.message); //hinzufügen der Nachricht mit den usernamen und dem Textinhalt
});

socket.on("user_join", function(data){
  addMessage(data + " just joined the chat!"); //Nachricht welcher user gejoint ist
});

socket.on("user_leave", function(data){
  addMessage(data + " has left the chat."); //Nachricht welcher user geleavt ist
});

addMessage("You have joined the chat as '" + username + "' .");
socket.emit("user_join", username); //teilt anderen mit das man gejoint ist

function addMessage(message) {    //erwartet einen String 
  const li =document.createElement("li"); //erstellt ein neues Listen Objekt
  li.innerHTML =message; //nimmt den eigegeben Sting und setzt in in das neue li Objekt
  messages.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);  //scrollen zum ende damit die neuste Nachricht direkt im Blick ist
}