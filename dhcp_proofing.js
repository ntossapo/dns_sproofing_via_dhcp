/**
 * Created by benvo_000 on 18/8/2558.
 */
var config = {
    listeningPort : 67,
    proofingPort : 68,
    host : "172.26.240.205",
    hexHost : "ac1af0cd",
    hexSubnetMask : "ffffff00",
    hexRouter : "ac1af001",
    hexDomainNameServer : "ac1af0cd",
    hexDomainName : "6162636465662e636f6d",
    hexIpAddrLeaseTime : "",
    hexRenewalTimeValue : "",
    hexRebindingTimeValue : "",
};

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var response = {
    transactionId: "",
    requestIpAddress : "",
    requestIpAddressHex : "",
    clientMacAddress : "",
    dhcpServerProofingIp : "ac1af25f",
    dhcpSubnetProofingIp : "ffffff00",
    dhcpRouterProofingIp : "c0a80101",
    dhcpDnsProofingIp : "c0a80101",
    dhcpDnsName : "656565",
    dhcpIPAddrTimeLease : "00000e10",
    dhcpMessageTypeProofing : "05",
    optionRequest : [53, 54],
    buildOption : function(){

    },
    getMessage : function(){
        var stringBuilder = "";
        stringBuilder += "02";                      //message type : boot reply
        stringBuilder += "01";                      //hardware type : eth
        stringBuilder += "06";                      //hardware addr length : 6
        stringBuilder += "00";                      //hops : 0
        stringBuilder += this.transactionId;        //transaction id
        stringBuilder += "00";                      //seconds elapsed
        stringBuilder += "0000";                    //bootpflags;
        stringBuilder += "00000000";                //client ip addr
        stringBuilder += this.requestIpAddressHex;     //your client ip addr
        stringBuilder += "00000000";                //next server ip addr
        stringBuilder += "00000000";                //relay agent ip addr
        stringBuilder += this.clientMacAddress;     //client Mac addr
        stringBuilder += "00000000000000000000";    //client hardware addr padding

        for(var i=0;i < 64; i++)                    //server host name not given
            stringBuilder += "00";

        for(var i=0; i < 16; i++)                   //boot file name not given
            stringBuilder += "00000000";

        stringBuilder += "63825363";                //magic cookie : dhcp

        stringBuilder += "350105";                  //DHCP message type : ack

        for(var i=0; i < this.optionRequest; i++){
            switch(this.optionRequest[i]){
                case 53 :
                    stringBuilder += "350105";
                    break;
                case 54 :
                    stringBuilder += "3601";
                    stringBuilder += hostHex;
                    break;
                case 1 :
                    stringBuilder += "0104";
                    stringBuilder += config.hexSubnetMask;
                    break;
                case 3 :
                    stringBuilder += "0304";
                    stringBuilder += config.hexRouter;
                    break;
                case 6 :
                    stringBuilder += "0604";
                    stringBuilder += config.hexDomainNameServer;
                    break;
                case 15 :
                    stringBuilder += "0f";
                    stringBuilder += parseInt(config.hexDomainName.length/2, 16).toString();
                    stringBuilder += config.hexDomainName;
                    break;
                case 51 :
                    stringBuilder += "330400000e10";
                    break;
                case 58 :
                    stringBuilder += "3a0400000708";
                    break;
                case 59 :
                    stringBuilder += "3b0400000c4e";
                    break;
                default :
                    console.log("not found " + this.optionRequest[i]);
            }

        }

        stringBuilder += "ff";
        return stringBuilder;
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
    53: "DHCP MEssage Type",
    54: "DHCP Server Identifier",
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
    response.clientMacAddress = message.toString("hex", 28, 34);
    console.log("Client Mac Address: " + response.clientMacAddress);
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
                    response.requestIpAddressHex = message.toString(j+2, j+6, "hex");
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
                        response.optionRequest.push(message[k]);
                    }
                    checker["RequestOption"] = true;
                }
            }
            break;
        }
    }

    response.optionRequest.clear();
    console.log(response.getMessage());
});

server.bind(config.listeningPort, config.host);