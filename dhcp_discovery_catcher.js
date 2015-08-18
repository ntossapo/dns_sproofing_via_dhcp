/**
 * Created by benvo_000 on 18/8/2558.
 */
var port = 67;
var host = "172.19.74.64";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

//var

server.on('listening', function(){
    var address = server.address();
    console.log('DHCP Catcher listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log("\n");
    console.log("*************************************************************");
    console.log(remote.address + ":" + remote.port);
    console.log("*************************************************************");
    console.log(message);
    console.log("*************************************************************");
    console.log(message.length);
    console.log("Transaction Id: 0x" + message.toString("hex", 4, 8));
    console.log("Client Mac Address: " + message.toString("hex", 28, 29) + ":" + message.toString("hex", 29, 30) + ":" + message.toString("hex", 30, 31) + ":" + message.toString("hex", 31, 32) + message.toString("hex", 32, 33) + ":" + message.toString("hex", 33, 34));
    for(var i = 0;i < message.length;i++){
        if(message.toString("hex", i, i+1) == "0c"){
            var length = parseInt(message[i+1].toString());
            console.log(length);
            var hostname = "";
            for(var j = 0;j < length;j++){
                hostname += message.toString("ascii", i+j, i+j+1);
            }
            console.log("Host Name: " + hostname);
            break;
        }
    }
    console.log("*************************************************************");
});

server.bind(port, host);