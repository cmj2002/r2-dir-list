# R2 Directory Listing

This is a simple Directory Listing script for [Cloudflare R2](https://developers.cloudflare.com/r2/) and hosted on [Cloudflare Workers](https://workers.cloudflare.com/). It is inspired by the [Directory Listing of Gitea downloads site](https://blog.gitea.com/evolution-of-the-gitea-downloads-site/).

## Usage

Clone this repository, install dependencies and edit the configs:

```bash
git clone https://github.com/cmj2002/r2-dir-list.git
cd r2-dir-list
npm install
mv src/config.ts.example src/config.ts
mv wrangler.toml.example wrangler.toml
```

You should edit:
- `bucketname` in `src/config.ts` and `wrangler.toml` to your bucket name.
- `bucketdomain.example.com` in `src/config.ts` and `wrangler.toml` to your bucket domain. **It must have been set as a [custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/#custom-domains) of your Cloudflare R2 bucket**.
- `example.com` in `wrangler.toml`'s `zone_name` to yours.
- Other settings like `name`, `desp`, `showPoweredBy` and `legalInfo` in `src/config.ts` to your own.

You may want to search `bucketdomain`, `bucketname` and `example.com` in your code to ensure you have edited all of them.

Then you can run `wrangler deploy` to deploy it to your Cloudflare Workers.
