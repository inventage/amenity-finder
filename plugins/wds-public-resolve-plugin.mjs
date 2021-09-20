import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { globbySync } from 'globby';

export const publicResolvePlugin = (publicPath = 'public') => {
  const publicFiles = globbySync(`${publicPath}/**/*`);
  const publicFilesWithoutPrefix = publicFiles.map(file => file.replace(publicPath, ''));

  return {
    name: 'resolve-public',
    serve(context) {
      const pathWithoutLeadingSlash = context.path.replace(/^\//, '');
      const fileSystemPath = resolve(publicPath, pathWithoutLeadingSlash);
      if (publicFilesWithoutPrefix.includes(context.path) && existsSync(fileSystemPath)) {
        return readFileSync(fileSystemPath, 'utf-8');
      }
    },
  };
};
