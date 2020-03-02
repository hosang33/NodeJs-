module.exports = (io,useSession) => {
    const sharedSession = require('express-socket.io-session');
    io.use(sharedSession(useSession));

    roomList = new Array;

    io.on('connection', (socket) => {

       /**
        * 방 리스트 입장 
        * 
        * @ emit  방 목록 To 현재 접속자 한명   
        */
        io.to(socket.id).emit('res roomList',roomList); 

        /**
        * 방 생성
        * 
        * @ param roomId 방번호
        * @ emit  방 목록 To 방 목록 클라이언트
        */
        socket.on('req createRoom', (paramObject) => { 
            paramObject.roomId = socket.id; 
            paramObject.sameRoomUsers = [];
            paramObject.msgs = [];

            roomList.push(paramObject);

            io.to(socket.id).emit('res roomId',socket.id);
            io.emit('res roomList',roomList);
        });
        
        /**
        * 방 입장
        * 
        * @ param  nickName 닉네임 
        * @ param  roomId   방번호
        * @ emit   방 정보 To 해당 방 유저들
        */
        socket.on('req roomInfos', (paramJson) => {
            socket.join(paramJson.roomId);

            var findedRoom = findRoom(paramJson.roomId)

            if(findedRoom.sameRoomUsers.indexOf(paramJson.nickName) === -1) { //중복 입장이 아니라면 
                findedRoom.sameRoomUsers.push(paramJson.nickName) 
            } 
            io.to(paramJson.roomId).emit('res roomInfos',findedRoom); 
           // io.to(socket.id).emit('res duplicateJoinRoom',"location.href=/lobby")//중복 입장 시 로비 이동  

        })

        /**
        * 방 나가기/ 방 삭제
        * 
        * @ param  nickName 닉네임 
        * @ param  roomId   방번호
        * @ emit   방 목록 To 방 목록 클라이언트
        * @ emit   방 정보 To 해당 방 유저들 
        */
        socket.on('req exitRoom', (paramJson) => { 
            socket.leave(paramJson.roomId);

            var myRoom = findRoom(paramJson.roomId);
            myRoom.sameRoomUsers.splice(myRoom.sameRoomUsers.indexOf(paramJson.nickName),1);
            // 아무도 없으면 방 삭제 
            if(!io.sockets.adapter.rooms[paramJson.roomId]) {
                roomDeleteInArray(paramJson.roomId);
                io.emit('res roomList',roomList); 
            }

            io.to(paramJson.roomId).emit('res roomInfos',myRoom);
        })
        
        /**
        * 메세지 전송 
        * 
        * @ param  nickName 닉네임 
        * @ param  roomId   방번호
        * @ param  msg      메세지
        * @ emit   방 정보 To 해당 방 유저들 
        */
        socket.on('req sendMessage', (paramJson) => {
            var myRoom = findRoom(paramJson.roomId);
            myRoom.msgs.push({
                nickName : paramJson.nickName,
                msg : paramJson.msg
            });
            io.to(paramJson.roomId).emit('res roomInfos',myRoom);
        })
    });


    function findRoom(roomId) {
        for (var i = 0; i < roomList.length; i++){  
            if (roomList[i].roomId == roomId){
               return roomList[i]
            }
          }
    }

    function roomDeleteInArray(roomId) {
        for (var i = 0; i < roomList.length; i++){  
            if (roomList[i].roomId == roomId){
                roomList.splice([i],1)
            }
          }
    }
  };