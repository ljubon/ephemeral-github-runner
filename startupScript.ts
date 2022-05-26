import * as pulumi from "@pulumi/pulumi";
import { readFileSync } from 'fs';
import { registrationToken } from "./token-fetcher";

/* tslint:disable-next-line:no-var-requires */
const Mustache = require("mustache");
const config = new pulumi.Config();

export const startupScript = registrationToken.then(token => {
    const templateView = {
        owner: config.require("owner"),
        repo: config.require("repo"),
        labels: config.require("labels"),
        token,
    };
    const template = readFileSync('../register-runner.sh', 'utf-8');
    // Disable all escaping
    Mustache.escape = (text: string): string => {
        return text;
    };
    return Mustache.render(template, templateView);
});