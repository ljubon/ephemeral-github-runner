import * as aws from "@pulumi/aws";
import { LaunchConfiguration, LaunchTemplateArgs } from "@pulumi/aws/ec2";
import * as pulumi from "@pulumi/pulumi";
import { securityGroup } from './security-group';
import { startupScript } from '../startupScript';
import { Buffer } from 'buffer';

const config = new pulumi.Config();
const size = config.require("machineType");

export const launchTemplate = aws.getCallerIdentity({}).then(identity => {
    return startupScript.then(script => {
        const ami = aws.ec2.getAmiOutput({
            filters: [{
                name: "name",
                values: [ config.require("machineImage") ],
            }],
            owners: [identity.accountId],
        });
        const launchTemplateArgs: LaunchTemplateArgs = {
            monitoring: {
                enabled: true,
            },
            blockDeviceMappings: [{
                deviceName: "/dev/sda1",
                ebs: {
                    volumeSize: config.requireNumber("bootDiskSizeInGB"),
                    volumeType: config.require("bootDiskType")
                },
            }],
            namePrefix: "ghrunner-asg",
            imageId: ami.id,
            instanceType: size,
            keyName: "gross-devops-us-east-1",
            vpcSecurityGroupIds: [ securityGroup.id ],
            userData: Buffer.from(script).toString("base64"),
            tags: {
                "Name": "Github Runner"
            }
        }
        return new aws.ec2.LaunchTemplate("ghrunner-lt", launchTemplateArgs);
    });
});