import { constants } from '../constants';
import { applicationConfig } from '../models/applicationConfig';
import { templates } from '../templates';
import { linkPackage } from './utils';

const appRouter = applicationConfig()
  .setName('next-app-router')
  .useTemplate(templates['next-app-router'])
  .setEnvFormatter('public', key => `NEXT_PUBLIC_${key}`)
  .addScript('setup', constants.E2E_NPM_FORCE ? 'pnpm install --force' : 'pnpm install')
  .addScript('dev', constants.E2E_NEXTJS_VERSION === '13' ? 'pnpm dev:webpack' : 'pnpm dev')
  .addScript('build', 'pnpm build')
  .addScript('serve', 'pnpm start')
  .addDependency('next', constants.E2E_NEXTJS_VERSION)
  .addDependency('react', constants.E2E_REACT_VERSION)
  .addDependency('react-dom', constants.E2E_REACT_DOM_VERSION)
  .addDependency('@appypeeps/clerk-nextjs', constants.E2E_CLERK_VERSION || linkPackage('nextjs'))
  .addDependency('@appypeeps/clerk-shared', linkPackage('shared'))
  .addDependency('@appypeeps/clerk-types', linkPackage('types'));

const appRouterTurbo = appRouter.clone().setName('next-app-router-turbopack').addScript('dev', 'pnpm dev');

const appRouterQuickstart = appRouter
  .clone()
  .setName('next-app-router-quickstart')
  .useTemplate(templates['next-app-router-quickstart']);

const appRouterAPWithClerkNextLatest = appRouterQuickstart.clone().setName('next-app-router-ap-clerk-next-latest');

const appRouterAPWithClerkNextV4 = appRouterQuickstart
  .clone()
  .setName('next-app-router-ap-clerk-next-v4')
  .addDependency('@appypeeps/clerk-nextjs', '4')
  .addFile(
    'src/middleware.ts',
    () => `import { authMiddleware } from '@appypeeps/clerk-nextjs';

    export default authMiddleware({
      publicRoutes: ['/']
    });

    export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
    };
    `,
  );

export const next = {
  appRouter,
  appRouterTurbo,
  appRouterQuickstart,
  appRouterAPWithClerkNextLatest,
  appRouterAPWithClerkNextV4,
} as const;
