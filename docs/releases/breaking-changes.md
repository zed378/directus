---
description: A list of any actions you may need to take on upgrades of Directus.
---

# Breaking Changes

As we continue to build Directus, we occasionally make changes that change how certain features works. We try and keep
these to a minimum, but rest assured we only make them with good reason.

[Learn more about Versioning](/getting-started/architecture#versioning)

[Learn more about Upgrading your Instance](/self-hosted/upgrades-migrations)

Starting with Directus 10.0, here is a list of potential breaking changes with remedial action you may need to take.

## Version 10.9.0

### Updated Exif Tags

The library `exif-reader`, which is used for Exif metadata extraction of images, has been updated to v2. In this
release, tag names have been updated to align with the Exif standard. See
https://github.com/devongovett/exif-reader/pull/30 for a complete list of updated tags.

This might be a breaking change if a custom `FILE_METADATA_ALLOW_LIST` config is in place, or you rely on the generated
Exif tags stored in Directus Files to not change name.

The updated Exif tags only apply to images which are uploaded after upgrading to this release.

### Dropped Support for SDK Scoped Entrypoints

You can no longer import parts of the SDK through scoped entrypoints to prevent issues with TypeScript based libraries
consuming the SDK.

Any scoped imports of `@directus/sdk` will need updating to import functions from the root.

::: details Migration/Mitigation

::: code-group

```js [Before]
import { createDirectus } from '@directus/sdk';
import { rest } from '@directus/sdk/rest';
```

```js [After]
import { createDirectus, rest } from '@directus/sdk';
```

:::

### Dropped Support for Asynchronous Logic In JS Config Files

Environment handling has been moved to a new `@directus/env` package. With this new package, ESM config files are still
supported, but will no longer support running asynchronous code within them.

### Updated Sorting in Schema Snapshots

The sort order of fields and relations inside schema snapshots has been changed to their original creation order. This
is to increase consistency of resulting snapshots artifacts.

While this is not a breaking change, you are advised to regenerate the snapshot after the version update of Directus,
provided you are tracking the snapshot in a version control system.

## Version 10.8.3

### Updated GraphQL Content Version Usage

Previously when accessing content versions via GraphQL, a `version` parameter was used on existing fields. This has now
been changed and is accessed via dedicated query types (`<collection>_by_version` and `versions`).

::: details Migration/Mitigation

::: code-group

```graphql [Before]
# Get an item's version by id
query {
	<collection>_by_id(id: 15, version: "draft") {
		id
		title
		body
	}
}

# Get a version singleton or list versions in a collection
query {
	<collection>(version: "draft") {
		id
		title
		body
	}
}
```

```graphql [After]
# Get an item's version by id
query {
	<collection>_by_version(id: 15, version: "draft") {
		id
		title
		body
	}
}

# Get a version singleton
query {
	<collection>_by_version(version: "draft") {
		id
		title
		body
	}
}

# List versions in a collection (`/graphql/system`)
query {
	versions(filter: { collection: { _eq: "posts" } }) {
        item
        key
    }
}
```

:::

### Renamed `ExtensionItem` Type in the SDK

The `ExtensionItem` type has been renamed to `DirectusExtension` to be inline with other system collections.

## Version 10.7.0

### Replaced Extensions List Endpoints

In previous releases, it was possible to `GET /extensions/:type` to retrieve a list of enabled extensions for a given
type.

This has been replaced with a `GET /extensions` endpoint that returns all extensions along with their type and status.

## Version 10.6.2

### Swapped Parameters and Auth Mode for Refresh Method in the SDK

The parameter order for the `refresh` method and thus also the default auth mode have been swapped in order to work well
with both auth modes, `cookie` and `json`.

::: details Migration/Mitigation

::: code-group

```js [Before]
// refresh http request using a cookie
const result = await client.request(refresh('', 'cookie'));

// refresh http request using json
const result = await client.request(refresh(refresh_token));
const result = await client.request(refresh(refresh_token, 'json'));
```

```js [After]
// refresh http request using a cookie
const result = await client.request(refresh());
const result = await client.request(refresh('cookie'));

// refresh http request using json
const result = await client.request(refresh('json', refresh_token));
```

:::

### Renamed Helper Function in the SDK

The SDK helper function `asSearch` has been renamed to `withSearch` for naming consistency in helpers.

## Version 10.6

### Dropped Support for Custom NPM Modules in the Run Script operation in Flows

Prior to this release, Directus relied on `vm2` to run code from **Run Script** operations in Flows - our automation
feature. `vm2` is now unmaintained with critical security issues that could potentially allow code to escape the sandbox
and potentially access the machine which hosts your Directus project. We have migrated to `isolated-vm` to allow Flows
to continue to run safely.

If you used to rely on axios, node-fetch, or other libraries to make web requests, we strongly recommend migrating to
using the **Webhook / Request URL** operation instead. This operation includes additional security measures, like the IP
allow-list that prevents traffic. For other npm packages in Flows, your will need to
[create a custom operation extension](/guides/extensions/operations-npm-package).

## Version 10.4

### Consolidated Environment Variables for Redis Use

Directus had various different functionalities that required you to use Redis when running Directus in a horizontally
scaled environment such as caching, rate-limiting, realtime, and flows. The configuration for these different parts have
been combined into a single set of `REDIS` environment variables that are reused across the system.

::: details Migration/Mitigation

Combine all the `*_REDIS` environment variables into a single shared one as followed:

::: code-group

```ini [Before]
CACHE_STORE="redis"
CACHE_REDIS_HOST="127.0.0.1"
CACHE_REDIS_PORT="6379"
...
RATE_LIMITER_STORE="redis"
RATE_LIMITER_REDIS_HOST="127.0.0.1"
RATE_LIMITER_REDIS_PORT="6379"
...
SYNCHRONIZATION_STORE="redis"
SYNCHRONIZATION_REDIS_HOST="127.0.0.1"
SYNCHRONIZATION_REDIS_PORT="6379"
...
MESSENGER_STORE="redis"
MESSENGER_REDIS_HOST="127.0.0.1"
MESSENGER_REDIS_PORT="6379"
```

```ini [After]
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"

CACHE_STORE="redis"
RATE_LIMITER_STORE="redis"
SYNCHRONIZATION_STORE="redis"
MESSENGER_STORE="redis"
```

:::

### Dropped Support for Memcached

Directus used to support either memory, Redis, or Memcached for caching and rate-limiting storage. Given a deeper
integration with Redis, and the low overall usage/adoption of Memcached across Directus installations, we've decided to
sunset Memcached in favor of focusing on Redis as the primary solution for pub/sub and hot-storage across load-balanced
Directus installations.

### Updated Errors Structure for Extensions

As part of standardizing how extensions are built and shipped, you must replace any system exceptions you extracted from
`exceptions` with new errors created within the extension itself. We recommend prefixing the error code with your
extension name for improved debugging, but you can keep using the system codes if you relied on that in the past.

::: details Migration/Mitigation

::: code-group

```js [Before]
export default (router, { exceptions }) => {
	const { ForbiddenException } = exceptions;

	router.get('/', (req, res) => {
		throw new ForbiddenException();
	});
};
```

```js [After]
import { createError } from '@directus/errors';

const ForbiddenError = createError('MY_EXTENSION_FORBIDDEN', 'No script kiddies please...');

export default (router) => {
	router.get('/', (req, res) => {
		throw new ForbiddenError();
	});
};
```

:::

## Version 10.2

### Removed Fields from Server Info Endpoint

As a security precaution, we have removed the following information from the `/server/info` endpoint:

- Directus Version
- Node Version and Uptime
- OS Type, Version, Uptime, and Memory
