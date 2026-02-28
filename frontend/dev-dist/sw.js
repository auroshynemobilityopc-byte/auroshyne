/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-f9d29cf2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "/index.html",
    "revision": "0.c45qun671go"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("/index.html"), {
    allowlist: [/^\/$/]
  }));
  workbox.registerRoute(/^\/(?!admin).*\/(api\/(bookings|services|profile|history)).*/i, new workbox.NetworkFirst({
    "cacheName": "customer-api-stale-cache",
    "networkTimeoutSeconds": 3,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 604800
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^\/$/, new workbox.CacheFirst({
    "cacheName": "customer-home-page",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 5,
      maxAgeSeconds: 86400
    })]
  }), 'GET');
  workbox.registerRoute(/^\/history/, new workbox.NetworkFirst({
    "cacheName": "customer-history-page",
    "networkTimeoutSeconds": 5,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 43200
    })]
  }), 'GET');
  workbox.registerRoute(/^\/(?!admin).*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "customer-api-post",
    plugins: []
  }), 'POST');
  workbox.registerRoute(/^\/(?!admin).*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "customer-api-patch",
    plugins: []
  }), 'PATCH');
  workbox.registerRoute(/^\/(?!admin).*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "customer-api-delete",
    plugins: []
  }), 'DELETE');
  workbox.registerRoute(/^\/admin\/.*\/api\/(bookings|customers|services|dashboard|technicians).*/i, new workbox.NetworkFirst({
    "cacheName": "admin-api-stale-cache",
    "networkTimeoutSeconds": 3,
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 604800
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^\/admin\/.*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "admin-api-post",
    plugins: []
  }), 'POST');
  workbox.registerRoute(/^\/admin\/.*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "admin-api-patch",
    plugins: []
  }), 'PATCH');
  workbox.registerRoute(/^\/admin\/.*\/api\/.*/i, new workbox.NetworkOnly({
    "cacheName": "admin-api-delete",
    plugins: []
  }), 'DELETE');

}));
