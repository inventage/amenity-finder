import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { globbySync } from 'globby';

export const publicResolvePlugin = (publicPath = 'public') => {
  const publicFiles = globbySync(`${publicPath}/**/*`);
  const publicFilesWithoutPrefix = publicFiles.map(file => file.replace(publicPath, ''));

  return {
    name: 'resolve-public',
    // eslint-disable-next-line consistent-return
    serve(context) {
      const pathWithoutLeadingSlash = context.path.replace(/^\//, '');
      const fileSystemPath = resolve(publicPath, pathWithoutLeadingSlash);
      if (publicFilesWithoutPrefix.includes(context.path) && existsSync(fileSystemPath)) {
        return readFileSync(fileSystemPath, 'utf-8');
      }
    },
  };
};
