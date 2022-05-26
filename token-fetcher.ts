import * as pulumi from '@pulumi/pulumi';
import { App } from "octokit";

const config = new pulumi.Config();
const owner = config.require("owner");
const repo = config.require("repo");

async function fetchToken(): Promise<String> {
  const app = new App({
    appId: Number(process.env.APP_ID),
    privateKey: String(process.env.APP_PRIVATE_KEY),
  });

  for await (const { data: installations } of app.octokit.paginate.iterator(
    app.octokit.rest.apps.listInstallations,
  )) {
    for (const installation of installations) {
      if (installation.account!.login === owner) {
        const octokit = await app.getInstallationOctokit(installation.id);
        const {
          data: { token }
        } = await octokit.rest.actions.createRegistrationTokenForRepo({
          owner: owner,
          repo: repo,
        });
        return token;
      }
    }
  }

  throw `No installation found for ${owner}`;
}

export const registrationToken = fetchToken();