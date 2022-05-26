import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

// Create a network
const baseName = pulumi.getStack();

export const network = new gcp.compute.Network(`${baseName}-network`, {
  autoCreateSubnetworks: false,
  routingMode: "REGIONAL",
});

export const subnetwork = new gcp.compute.Subnetwork(`${baseName}-subnetwork`, {
  ipCidrRange: "10.1.0.0/16",
  network: network.id,
});