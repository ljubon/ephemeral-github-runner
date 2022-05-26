import * as aws from "@pulumi/aws";
import { LaunchTemplateArgs } from "@pulumi/aws/ec2";
import * as pulumi from "@pulumi/pulumi";
import { securityGroup } from './security-group';
import { startupScript } from '../startupScript';
import { Buffer } from 'buffer';

const config = new pulumi.Config();
const size = config.require("machineType");
   
export const launchTemplate = startupScript.then(script => {
    const ami = aws.ec2.getAmiOutput({
        filters: [{
            name: "name",
            values: [ config.require("machineImage") ],
        }],
        owners: ["099720109477"], // This owner ID is Amazon
    });
    
    const launchTemplateArgs: LaunchTemplateArgs = {
        namePrefix: "ghrunner-asg",
        imageId: ami.id,
        instanceType: size,
        keyName: "gr-oss-team",
        vpcSecurityGroupIds: [ securityGroup.id ],
        userData: Buffer.from(script).toString("base64"),
        tags: {
            "Name": "Github Runner"
        }
    }
    return new aws.ec2.LaunchTemplate("ghrunner-lt", launchTemplateArgs);
});