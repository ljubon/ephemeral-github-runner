import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { startupScript } from '../startupScript';
import { securityGroup } from './security-group';

const config = new pulumi.Config();
const machineType = config.require("machineType");

export const instance = aws.getCallerIdentity({}).then(identity => {
    return startupScript.then(script => {
        const ami = aws.ec2.getAmiOutput({
            filters: [{
                name: "name",
                values: [ config.require("machineImage") ],
            }],
            owners: [identity.accountId],
        });
        const runnerInstance = new aws.ec2.Instance("ghrunner", {
            monitoring: true,
            ami: ami.id,
            instanceType: machineType,
            tags: getTags(),
            vpcSecurityGroupIds: [ securityGroup.id ],
            userData: Buffer.from(script).toString("base64"),
            ebsBlockDevices: [{
                deviceName: "/dev/sda1",
                volumeSize: config.requireNumber("bootDiskSizeInGB"),
                volumeType: config.require("bootDiskType")
            }],
        });
        return runnerInstance;
    });
})

function getTags(){
    let tags = {
        "Name": `${config.require("repo")} Github Runner`,
        "map-migrated": "d-server-01068mdjl5jze3"
    };

    return tags;
}