import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const baseName = pulumi.getStack();
    
export const securityGroup = new aws.ec2.SecurityGroup("ghrunner-sg", {
    ingress: [
        { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    ],
    egress: [
        { protocol: "tcp", fromPort: 0, toPort: 65535, cidrBlocks: ["0.0.0.0/0"] },
    ],
    tags: {
        "Name": "Github Runner"
    }
});
