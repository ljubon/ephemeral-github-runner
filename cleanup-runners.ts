// import { App } from "octokit";

// async function cleanup(owner: string, repo: string, label: string) {
//     const app = new App({
//         appId: Number(process.env.APP_ID),
//         privateKey: String(process.env.APP_PRIVATE_KEY),
//     });

//     for await (const { data: installations } of app.octokit.paginate.iterator(
//         app.octokit.rest.apps.listInstallations,
//     )) {
//         for (const installation of installations) {
//             if (installation.account!.login === owner) {
//                 const octokit = await app.getInstallationOctokit(installation.id);

//                 for await (const { data: runners } of octokit.paginate.iterator(
//                     octokit.rest.actions.listSelfHostedRunnersForRepo,
//                     {
//                         owner,
//                         repo,
//                     }
//                 )) {
//                     for (const runner of runners) {
//                         if (runner.status === "offline" && runner.labels.map(x => x.name).includes(label)) {
//                             octokit.rest.actions.deleteSelfHostedRunnerFromRepo({
//                                 owner,
//                                 repo,
//                                 runner_id: runner.id,
//                             });
//                             console.log("Removed offline self-hosted runner %d (%s)", runner.id, runner.name);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

// const [owner, repo, label] = process.argv.slice(2);

// cleanup(owner, repo, label);