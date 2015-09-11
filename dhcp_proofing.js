/**
 * Created by benvo_000 on 18/8/2558.
 */
var listeningPort = 67;
var proofingPort = 68;
var host = "192.168.1.24";

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var response = {
    transactionId: "",
    requestIpAddress : "",
    dhcpServerProofingIp : "ac1af25f",
    dhcpSubnetProofingIp : "ffffff00",
    dhcpRouterProofingIp : "c0a80101",
    dhcpDnsProofingIp : "c0a80101",
    dhcpDnsName : "656565",
    dhcpIPAddrTimeLease : "00000e10",
    dhcpMessageTypeProofing : "05",
    /*res :   "0000000000009cd2" + "1e6606ed00000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "000000000000" + "63825363",*/
    messageBuffer : function(){
        return new Buffer("02010600"
            + this.transactionId + "000000000000" + "0000" + this.requestIpAddress + "0000" +
            "0000000000009cd2" + "1e6606ed00000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "0000000000000000" + "0000000000000000" +
            "000000000000" +
            "63825363" +
            "3501" + response.dhcpMessageTypeProofing +
            "3604" + response.dhcpServerProofingIp +
            "0104" + response.dhcpSubnetProofingIp +
            "0304" + response.dhcpRouterProofingIp +
            "0604" + response.dhcpDnsProofingIp +
            "0f03" + response.dhcpDnsName +
            "3304" + response.dhcpIPAddrTimeLease +
            "3a0400000708" +
            "3b0400000c4e" +
            "ff"
            , "hex");
    },
};
var dhcpRequestType = {
    1 : "DHCP Discover messageBuffer (DHCPDiscover)",
    2 : "DHCP Offer messageBuffer (DHCPOffer)",
    3 : "DHCP Request messageBuffer (DHCPRequest)",
    4 : "DHCP Decline messageBuffer (DHCPDecline)",
    5 : "DHCP Acknowledgment messageBuffer (DHCPAck)",
    6 : "DHCP Negative Acknowledgment messageBuffer (DHCPNak)",
    7 : "DHCP Release messageBuffer (DHCPRelease)",
    8 : "DHCP Informational messageBuffer (DHCPInform)",
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
    //console.log(messageBuffer);
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
    response.transactionId = message.toString("hex", 4, 8);
    console.log("Transaction Id: 0x" + response.transactionId);
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
                    res += "3501" + response.dhcpMessageTypeProofing;
                    j=j+2;
                }
                if(message.toString("hex", j, j+1) == "32" && checker["RequestIp"] == false){
                    response.requestIpAddress = message.toString(j+2, j+6, "hex");
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
    var res = response.messageBuffer();
    console.log(res);
    server.send(res, 0, res.length, proofingPort, "192.168.1.10", function(err){
        console.log(err);
    });
    console.log("send messageBuffer");
    console.log("*************************************************************");
});

server.bind(listeningPort, host);