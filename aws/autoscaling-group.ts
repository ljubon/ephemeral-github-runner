import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { launchTemplate } from './launch-template';

const config = new pulumi.Config();
const baseName = pulumi.getStack();

export const autoscalingGroup = launchTemplate.then(lt => {
    const availabilityZones = pulumi.output(aws.getAvailabilityZones({
        filters: [{
            name: "region-name",
            values: [ String(process.env.AWS_REGION) ],
        }]
    }));
    
    return new aws.autoscaling.Group("ghrunner-asg", {
        availabilityZones: availabilityZones.names,
        desiredCapacity: config.requireNumber("runnersCount"),
        maxSize: config.requireNumber("runnersCount"),
        minSize: config.requireNumber("runnersCount"),
        launchTemplate: {
            id: lt.id,
            version: `$Latest`,
        },
        tags: [{
            key: "Name",
            propagateAtLaunch: true,
            value: "Github Runner"
        }]
    });
});