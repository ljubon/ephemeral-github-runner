import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

export const subnetwork = pulumi.output(gcp.compute.getSubnetwork({
  name: "ilgpu-network-subnet",
  region: process.env.GOOGLE_REGION,
}));