// .pnpmfile.cjs — Allow Prisma, esbuild, and related packages to run postinstall scripts
'use strict';

module.exports = {
  hooks: {
    readPackage(pkg) {
      return pkg;
    },
  },
};
