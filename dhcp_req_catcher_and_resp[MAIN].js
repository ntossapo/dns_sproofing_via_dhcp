/**
 * Created by benvo_000 on 19/9/2558.
 */

var util = require('./util');
var config = {
    listeningPort : 67,
    proofingPort : 68,
    host : "192.168.1.2",
    subnet : "255.255.255.0",
    router : "192.168.1.1",
    dns : "192.168.1.2",
    dnsname : "testdnsserver"
};


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


// config bootp respnse before response
var bootpResponse = {
    messsageType : new Buffer("02", "hex"),
    hardwareType : new Buffer("01", "hex"),
    hardwareAddresLength : new Buffer("06", "hex"),
    hops : new Buffer("00", "hex"),
    transactionId : null,
    secondsElapsed : new Buffer("0000", "hex"),
    bootpFlags : new Buffer("0000", "hex"),
    clientIpAddress : new Buffer("00000000", "hex"),
    yourIpAddress : null,
    nextServerIpAddress : new Buffer("00000000", "hex"),
    relayAgentIpAddress : new Buffer("00000000", "hex"),
    clientMacAddress : null,
    clientHardwareAddressPadding : function(){
        var bufferString = "";
        for(var i = 0; i < 10; i++){
            bufferString += "00";
        }
        return new Buffer(bufferString, "hex");
    },
    serverHostnameNotGiven : function(){
        var bufferString = "";
        for(var i = 0; i < 64; i++){
            bufferString += "00";
        }
        return new Buffer(bufferString, "hex");
    },
    bootFilenameNotGiven : function(){
        var bufferString = "";
        for(var i = 0; i < 128; i++){
            bufferString += "00";
        }
        return new Buffer(bufferString, "hex");
    },
    //default magic cookie
    magicCookie : new Buffer("63825363", "hex"),
    //default dhcp messsage type
    dhcpMessageType : new Buffer("350105", "hex"),
    dhcpServerIdentifier : null,
    subnetMask : null,
    router : null,
    domainNameServer : null,
    domainName : null,
    //3x is type of option, 04 is length, other is value
    ipAddressLeaseTime : new Buffer("330400000e10", "hex"),
    renewalTimeValue : new Buffer("3a0400000708", "hex"),
    rebindingTimeValue : new Buffer("3b0400000c4e", "hex"),
    end : new Buffer("ff", "hex"),
    response : function(){
        bootpResponse.transactionId = bootpProtocal.transactionId;
        bootpResponse.yourIpAddress = bootpProtocal.option.requestedIpAddress;
        bootpResponse.clientMacAddress = bootpProtocal.clientMacAddress;
        bootpResponse.dhcpServerIdentifier = Buffer.concat([new Buffer("3604", "hex"), new Buffer(util.ipToHex(config.host), "hex")]);
        bootpResponse.subnetMask = Buffer.concat([new Buffer("0104", "hex"), new Buffer(util.ipToHex(config.subnet), "hex")]);
        bootpResponse.router = Buffer.concat([new Buffer("0304", "hex"), new Buffer(util.ipToHex(config.router), "hex")]);
        bootpResponse.domainNameServer = Buffer.concat([new Buffer("0604", "hex"), new Buffer(util.ipToHex(config.dns), "hex")]);
        bootpResponse.domainName = Buffer.concat([new Buffer("0f"+util.LengthToHex(config.dnsname.length), "hex"), new Buffer(util.StringToHex(config.dnsname), "hex")]);
        var arrayConcat = [
            bootpResponse.messsageType,
            bootpResponse.hardwareType,
            bootpResponse.hardwareAddresLength,
            bootpResponse.hops,
            bootpResponse.transactionId,
            bootpResponse.secondsElapsed,

            bootpResponse.bootpFlags,
            bootpResponse.clientIpAddress,
            bootpResponse.yourIpAddress,
            bootpResponse.nextServerIpAddress,
            bootpResponse.relayAgentIpAddress,

            bootpResponse.clientMacAddress,
            bootpResponse.clientHardwareAddressPadding(),
            bootpResponse.serverHostnameNotGiven(),
            bootpResponse.bootFilenameNotGiven(),
            bootpResponse.magicCookie,
            bootpResponse.dhcpMessageType,
            bootpResponse.dhcpServerIdentifier,
            bootpResponse.subnetMask,

            bootpResponse.router,
            bootpResponse.domainNameServer,
            bootpResponse.domainName,
            bootpResponse.ipAddressLeaseTime,
            bootpResponse.renewalTimeValue,
            bootpResponse.rebindingTimeValue,
            bootpResponse.end
        ]
        return Buffer.concat(arrayConcat);
    }
}

var utilityFunction = {
    IpToHex : function(string){
        var sliptedIp = string.split(".");
        var result = "";
        for (var i = 0; i < sliptedIp.length; i++) {
            var decimal = parseInt(sliptedIp[i]);
            result += decimal.toString(16);
        }
        return result;
    },
    HexToIp : function(string) {
        var result = "";
        for (var i = 0; i < string.length; i += 2) {
            var hex = string[i] + string[i + 1];
            var dec = parseInt(hex, 16);
            dec = dec.toString();
            if (i < string.length - 2)
                result += dec + ".";
            else
                result += dec;
        }
        return result;
    },
    HexToString : function(hex){
        return hex.toString('ascii');
    },
    stringToHex : function(string){
        return new Buffer(string);
    },
    IsItInArray : function(array, value){
        for(var i = 0;i < array.length; i++){
            if(array[i] == value)
                return true;
        }
        return false;
    }
}

var dhcpRequestType = {
    1 : "DHCP Discover (DHCPDiscover)",
    2 : "DHCP Offer (DHCPOffer)",
    3 : "DHCP Request (DHCPRequest)",
    4 : "DHCP Decline (DHCPDecline)",
    5 : "DHCP Acknowledgment (DHCPAck)",
    6 : "DHCP Negative Acknowledgment (DHCPNak)",
    7 : "DHCP Release (DHCPRelease)",
    8 : "DHCP Informational (DHCPInform)",
};

var bootpProtocal = {
    messageType : "",
    hardwareType : "",
    hardwareAddressLength : "",
    hops : "",
    transactionId : "",
    secondElapsed : "",
    bootpFlag : "",
    clientIpAddress : "",
    yourIpAddress : "",
    nextServerIpAddress : "",
    relayAgentIpAddress : "",
    clientMacAddress : "",

    magicCookie : "",
    option : {
        dhcpMessageType : "",
        clientIdentifier : "",
        requestedIpAddress : "",
        hostName : "",
        clientFullyQualifiedDoaminName : "",
        vendorClassIdentifier : "",
    },
    parameter : []
}

var optionChecklist = [];

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function(){
    var address = server.address();
    console.log('DHCP Catcher listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log("------------------------------------------------------------------");
    bootpProtocal.messageType = message[0];
    bootpProtocal.hardwareType = message[1];
    bootpProtocal.hardwareAddressLength = message[2];
    bootpProtocal.hops = message[3];
    bootpProtocal.transactionId = new Buffer(message.toString("hex", 4, 8), "hex");
    bootpProtocal.secondElapsed = new Buffer(message.toString("hex", 8, 10), "hex");
    bootpProtocal.bootpFlag = new Buffer(message.toString("hex", 10, 12), "hex");
    bootpProtocal.clientIpAddress = new Buffer(message.toString("hex", 12, 16), "hex");
    bootpProtocal.yourIpAddress = new Buffer(message.toString("hex", 16, 20), "hex");
    bootpProtocal.nextServerIpAddress = new Buffer(message.toString("hex", 20, 24), "hex");
    bootpProtocal.relayAgentIpAddress = new Buffer(message.toString("hex", 24, 28), "hex");
    bootpProtocal.clientMacAddress = new Buffer(message.toString("hex", 28, 34), "hex");
    bootpProtocal.magicCookie = new Buffer(message.toString("hex", 236, 240), "hex");

    for(var i = 240; i < message.length; i++){
        if(message[i] == 0x35 && !utilityFunction.IsItInArray(optionChecklist, 0x35)){
            var length = message[++i];
            bootpProtocal.option.dhcpMessageType = message[++i];
            optionChecklist.push(0x35);
            console.log("DHCP Message Type");
            console.log("\t" + dhcpRequestType[bootpProtocal.option.dhcpMessageType]);
        }else if(message[i] == 0x3d && !utilityFunction.IsItInArray(optionChecklist, 0x3d)){
            var length = message[++i];

            i++;
            bootpProtocal.option.clientIdentifier = new Buffer(message.toString("hex", i, i+length), "hex");
            optionChecklist.push(0x3d);
            i+=length-1;
            console.log("Client Identifier");
            console.log("\t"+bootpProtocal.option.clientIdentifier.toString("hex", 0, bootpProtocal.option.clientIdentifier.length));
        }else if(message[i] == 0x32 && !utilityFunction.IsItInArray(optionChecklist, 0x32)){
            var length = message[++i];

            i++;
            bootpProtocal.option.requestedIpAddress = new Buffer(message.toString("hex", i, i+length), "hex");
            optionChecklist.push(0x32);
            i+=length-1;
            console.log("Requested Ip Address");
            console.log("\t" + utilityFunction.HexToIp(bootpProtocal.option.requestedIpAddress.toString("hex")));

        }else if(message[i] == 0x0c && !utilityFunction.IsItInArray(optionChecklist, 0x0c)){
            var length = message[++i];

            i++;
            bootpProtocal.option.hostName = new Buffer(message.toString("hex", i, i+length), "hex");
            i+=length-1;
            optionChecklist.push(0x0c);
            console.log("Hostname")
            console.log("\t" + bootpProtocal.option.hostName.toString());

        }else if(message[i] == 0x51 && !utilityFunction.IsItInArray(optionChecklist, 0x51)){
            var length = message[++i];

            i++;
            bootpProtocal.option.clientFullyQualifiedDoaminName = new Buffer(message.toString("hex", i, i+length), "hex");
            i+=length-1;
            optionChecklist.push(0x51);
            console.log("Client Fully Qualified Domain Name");

        }else if(message[i] == 0x3c && !utilityFunction.IsItInArray(optionChecklist, 0x3c)){
            var length = message[++i];

            i++;
            bootpProtocal.option.vendorClassIdentifier = new Buffer(message.toString("hex", i, i+length), "hex");
            i+= length-1;
            optionChecklist.push(0x3c);
            console.log("Vendor class identifier");
            console.log("\t" + bootpProtocal.option.vendorClassIdentifier.toString("ascii"));

        }else if(message[i] == 0x37 && !utilityFunction.IsItInArray(optionChecklist, 0x37)){
            var length = message[++i];
            i++;
            console.log("Parameter Request List");
            for(var j = 0; j < length; j++){
                console.log("\t-" + requestItemList[message[i+j]]);
                bootpProtocal.parameter.push(message[i+j]);
            }
            i+=length-1;
            optionChecklist.push(0x37);
        }
    }

    var responseMessage = bootpResponse.response();
    server.send(responseMessage
        , 0
        , responseMessage.length
        , config.proofingPort
        , utilityFunction.HexToIp(bootpProtocal.option.requestedIpAddress.toString("hex"))
        , function(err, byte){
            if(err)
                console.log(err);
            else
                console.log("send invalid ack");
        });

    console.log("------------------------------------------------------------------");
    optionChecklist.length = 0;
    bootpProtocal.parameter.length = 0;
});
server.bind(config.listeningPort, config.host);


