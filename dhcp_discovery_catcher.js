/**
 * Created by benvo_000 on 18/8/2558.
 */
var port = 67;
var host = "192.168.1.4";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var dhcpRequestType = {
    1 : "DHCP Discover message (DHCPDiscover)",
    1 : "DHCP Offer message (DHCPOffer)",
    1 : "DHCP Request message (DHCPRequest)",
    1 : "DHCP Decline message (DHCPDecline)",
    1 : "DHCP Acknowledgment message (DHCPAck)",
    1 : "DHCP Negative Acknowledgment message (DHCPNak)",
    1 : "DHCP Release message (DHCPRelease)",
    1 : "DHCP Informational message (DHCPInform)",
}

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
                hostname += message.toString("ascii", i+j+1, i+j+2);
            }
            console.log("Host Name: " + hostname);
            break;
        }else if(message.toSring("hex", i, i+1) == "35"){

        }
    }
    console.log("*************************************************************");
});

server.bind(port, host);