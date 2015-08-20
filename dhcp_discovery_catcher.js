/**
 * Created by benvo_000 on 18/8/2558.
 */
var port = 67;
var host = "172.19.74.221";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var dhcpRequestType = {
    1 : "DHCP Discover message (DHCPDiscover)",
    2 : "DHCP Offer message (DHCPOffer)",
    3 : "DHCP Request message (DHCPRequest)",
    4 : "DHCP Decline message (DHCPDecline)",
    5 : "DHCP Acknowledgment message (DHCPAck)",
    6 : "DHCP Negative Acknowledgment message (DHCPNak)",
    7 : "DHCP Release message (DHCPRelease)",
    8 : "DHCP Informational message (DHCPInform)",
}

var requestItemList = {
    1: "Subnet Mask",
    3: "Router",
    6: "Domain Name Server",
    7: "Log Server",
    12: "Hostname",
    15: "Domain Name",
    24:	"MTU Timeout",
    25: "MTU Plateau",
    26: "MTU Interface",
    27: "MTU Subnet",
    28: "Broadcast Address",
    31: "Router Discovery",
    32: "Router Request",
    33: "Static Route",
    43: "Vendor Specific Information",
    44: "NetBIOS over TCP/IP Name Server",
    46: "NetBIOS over TCP/IP Node Type",
    47: "NetBIOS over TCP/IP Scope",
    51: "IP Address Lease Time",
    58: "Renewal Time Value",
    59: "Rebinding Time Value",
    119: "Domain Search",
    121: "Classless Static Route",
    249: "Private/Classless Static Route(Microsoft)",
    252: "Private/Proxy Auto-Discovery"
};

server.on('listening', function(){
    var address = server.address();
    console.log('DHCP Catcher listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log("\n");
    console.log("*************************************************************");
    console.log(remote.address + ":" + remote.port);
    ///console.log("*************************************************************");
    //console.log(message);
    var date = new Date();
    var checker = {
        "MessageType" : false,
        "RequestIp" : false,
        "Hostname" : false,
        "RequestOption" : false
    }
    console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    console.log("*************************************************************");
    console.log(message.length);
    console.log("Transaction Id: 0x" + message.toString("hex", 4, 8));
    console.log("Client Mac Address: " + message.toString("hex", 28, 29) + ":" + message.toString("hex", 29, 30) + ":" + message.toString("hex", 30, 31) + ":" + message.toString("hex", 31, 32) + ":" + message.toString("hex", 32, 33) + ":" + message.toString("hex", 33, 34));
    for(var i = 0;i < message.length;i++){
        if(message.toString("hex", i, i+4) == "63825363"){
            for(j=i;j<message.length;j++){
                if(message[j] == 60 && message[j+1] == 12) {
                    j = j+2;
                    continue;
                }
                if(message.toString("hex", j, j+1) == "35" && checker["MessageType"] == false){
                    console.log("Request Type : " + dhcpRequestType[message[j+2]]);
                    checker["MessageType"] = true;
                    j=j+2;
                }
                if(message.toString("hex", j, j+1) == "32" && checker["RequestIp"] == false){
                    console.log("Request For IP : " + message[j+2] + "." + message[j+3] + "." + message[j+4] + "." + message[j+5]);
                    checker["RequestIp"] = true;
                    j=j+5;
                }
                if(message[j-1] != 60 && message.toString("hex", j, j+1) == "0c" && checker["Hostname"] == false){
                    var length = parseInt(message[j+1]);
                    console.log("Hostname : " + message.toString("ascii", j+2, j+2+length));
                    checker["Hostname"] = true;
                    j=j+2+length;
                }
                if(message.toString("hex", j, j+1) == "37" && checker["RequestOption"] == false){
                    console.log("Request Item");
                    var length = message[j+1];
                    for(var k = j+2; k < j+length; k++){
                        console.log("\t- " + requestItemList[message[k]]);
                    }
                    checker["RequestOption"] = true;
                }
            }
            break;
        }
    }
    console.log("*************************************************************");
});

server.bind(port, host);