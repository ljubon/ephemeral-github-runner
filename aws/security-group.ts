import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export const securityGroup = new aws.ec2.SecurityGroup("ghrunner-sg", {
    egress: [
        { protocol: "tcp", fromPort: 0, toPort: 65535, cidrBlocks: ["0.0.0.0/0"] },
    ],
    tags: { 
        "Name": `${config.require("repo")} Github Runner`,
        "map-migrated": "d-server-01068mdjl5jze3"
    },
});
