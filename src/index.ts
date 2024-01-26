import { Env } from './types';
import { renderTemplFull } from './render';
import { getSiteConfig } from './config';

async function listBucket(bucket: R2Bucket, options?: R2ListOptions): Promise<R2Objects> {
    // List all objects in the bucket, launch new request if list is truncated
    const objects: R2Object[] = [];
    const delimitedPrefixes: string[] = [];

    // delete limit, cursor in passed options
    const requestOptions = {
        ...options,
        limit: undefined,
        cursor: undefined,
    };

    var cursor = undefined;
    while (true) {
        const index = await bucket.list({
            ...requestOptions,
            cursor,
        });
        objects.push(...index.objects);
        delimitedPrefixes.push(...index.delimitedPrefixes);
        if (!index.truncated) {
            break;
        }
        cursor = index.cursor;
    }
    return {
        objects,
        delimitedPrefixes,
        truncated: false
    };
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const originResponse = await fetch(request);
        // if status is not 404 or request path not end with '/', return origin response
        if ((originResponse.status !== 404) || (originResponse.url.slice(-1) !== '/')) {
            return originResponse;
        }
        const url = new URL(request.url);
        const domain = url.hostname;
        const path = url.pathname;
        // remove the leading '/'
        const objectKey = path.slice(1);
        const siteConfig = getSiteConfig(env, domain);
        if (!siteConfig) {
            // TODO: Should send a email to notify the admin
            return originResponse;
        }
        const bucket = siteConfig.bucket;
        const index = await listBucket(bucket, {
            prefix: objectKey,
            delimiter: '/',
            include: ['httpMetadata', 'customMetadata']
        });
        // if no object found, return origin response
        if (index.objects.length === 0 && index.delimitedPrefixes.length === 0) {
            return originResponse;
        }
        return new Response(
            renderTemplFull(index.objects, index.delimitedPrefixes, path, siteConfig),
            {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                },
                status: 200,
            },
        );
    },
};
