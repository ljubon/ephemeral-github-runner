import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { startupScript } from "../startupScript";
import { subnetwork } from "./network";

const config = new pulumi.Config();

const baseName = pulumi.getStack();
const labels = {
    "provided-by": "pulumi",
};

const scheduling = {
    preemptible: true,
    onHostMaintenance: "TERMINATE",
    automaticRestart: false,
};

const bootDisk = {
    autoDelete: true,
    deviceName: `${baseName}-boot-disk`,
    mode: "READ_WRITE",
    diskType: config.require("bootDiskType"),
    diskSizeGb: config.requireNumber("bootDiskSizeInGB"),
    sourceImage: config.require("machineImage"),
};

export const instanceTemplate = new gcp.compute.InstanceTemplate(`${baseName}-instance-template`, {
    machineType: config.require("machineType"),
    labels,
    scheduling,
    disks: [bootDisk],
    metadata: {
        // "startup-script": pulumi.secret(startupScript),
        "startup-script": startupScript,
    },
    networkInterfaces: [{
        subnetwork: subnetwork.id,
        accessConfigs: [{}], // accessConfigs must include a single empty config to request an ephemeral IP
    }],
});