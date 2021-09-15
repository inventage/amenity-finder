# Capacitor

This file contains Capacitor specific instructions and hints.

## v3 Specific Instructions

Some examples in the documentation still use v2 syntax (e.g. Importing Plugins from `@capacitor/core` instead of specific NPM packages for each plugin).

The [v3 migration guide](https://capacitorjs.com/docs/updating/3-0) has some good tips on what should be used in v3.

## Loading URLs inside Web View

See `allowNavigation` property in the [configuration file](https://capacitorjs.com/docs/config#configuration-file).

## iOS Design Considerations

### Notch / Viewport

- https://github.com/ionic-team/capacitor/issues/2100
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/

## Splash Screens and Icons

[This guide](https://capacitorjs.com/docs/guides/splash-screens-and-icons) outlines how to create splash screens and icons. 

### TL;DR:

```shell
$ npm install -g cordova-res
$ cordova-res ios --skip-config --copy
```

### Remove Alpha-Channel

Use [ImageMagick](https://stackoverflow.com/a/28937338/5882689):

```shell
$ convert resources/icon.png -alpha off resources/icon.png
```

## Important Links

- https://capacitorjs.com/docs/config#configuration-file
