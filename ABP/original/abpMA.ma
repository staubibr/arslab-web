[top]
components : sender@Sender
components : Network
components : receiver@Receiver

out : packetSent ackReceived
in : controlIn

Link : controlIn controlIn@sender
Link : dataOut@sender in1@Network
Link : out1@Network in@receiver
Link : out@receiver in2@Network 
Link : out2@Network ackIn@sender 
Link : packetSent@sender packetSent
Link : ackReceived@sender ackReceived

[sender]
preparation : 00:00:10:000
timeout : 00:00:20:000 

[receiver]
preparation : 00:00:10:000 

[Network]
components : subnet1@Subnet
components : subnet2@Subnet

out : in1 in2
out : out1 out2

Link : in1 in@subnet1
Link : out@subnet1 out1 
Link : in2 in@subnet2
Link : out@subnet2 out2 

[subnet1]
distribution : normal
mean : 3
deviation : 1

[subnet2]
distribution : normal
mean : 3
deviation : 1 

