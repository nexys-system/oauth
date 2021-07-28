# OAuth helpers

[![NPM package](https://badge.fury.io/js/%40nexys%2Foauth.svg)](https://www.npmjs.com/package/@nexys/oauth)
[![NPM package](https://img.shields.io/npm/v/@nexys/oauth.svg)](https://www.npmjs.com/package/@nexys/oauth)
[![Bundleophobia](https://badgen.net/bundlephobia/min/@nexys/oauth)](https://bundlephobia.com/result?p=@nexys/oauth)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Build and Test Package](https://github.com/nexys-system/oauth/actions/workflows/yarn.yml/badge.svg)](https://github.com/nexys-system/oauth/actions/workflows/yarn.yml)
[![Build and Test Package and (publish)](https://github.com/nexys-system/oauth/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/oauth/actions/workflows/publish.yml)


```
router.get("/sso/red", async (ctx) => {
  ctx.redirect(gh.oAuthUrl());
});

router.get("/sso/github/redirect", async (ctx) => {
  const { code } = ctx.query;
  const token = await gh.callback(code as string);
  const profile = await gh.getProfile(token);
  
  // here connect to the user management
  ctx.body = profile
});

```
