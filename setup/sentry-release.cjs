const { SentryCli } = require("@sentry/cli");
const { execSync } = require("child_process");

function hentRelease() {
  return execSync("git rev-parse --short HEAD").toString().trim();
}

async function opprettReleaseTilSentry() {
  const release = hentRelease();
  const authToken = process.env.SENTRY_AUTH_TOKEN;

  if (!release) {
    throw new Error("Klarte ikke å utlede release fra git");
  }

  if (!authToken) {
    throw new Error('"SENTRY_AUTH_TOKEN" er ikke satt');
  }

  const cli = new SentryCli();

  try {
    console.log(`Oppretter Sentry-release ${release}`);
    await cli.releases.new(release);

    console.log("Laster opp source maps");
    await cli.releases.uploadSourceMaps(release, {
      include: ["dist/public"],
      urlPrefix: "~/public",
      rewrite: false,
    });

    console.log("Releaser");
    await cli.releases.finalize(release);
  } catch (e) {
    console.error("Noe gikk galt under source map-opplasting:", e);
  }
}

opprettReleaseTilSentry();
