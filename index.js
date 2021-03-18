const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8000;
app.use(cors());
const io = require('socket.io')(http);




const pathName =(path.join(__dirname,"./public"))

app.use(express.static(pathName));




const users={};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
    
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name)
    });

    socket.on('send',message  =>{
        socket.broadcast.emit('receive',{message:message, name:users[socket.id]})
    });

    socket.on('disconnect',message  =>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(port,()=>{
    console.log(`server running on this port ${port}`)
})