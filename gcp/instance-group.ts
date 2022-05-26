import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { instanceTemplate } from "./instance-template";

const config = new pulumi.Config();
const baseName = pulumi.getStack();

export const instanceGroup = new gcp.compute.InstanceGroupManager(`${baseName}-instance-group`, {
    baseInstanceName: baseName,
    targetSize: config.requireNumber("runnersCount"),
    versions: [{
        instanceTemplate: instanceTemplate.id,
    }],
});