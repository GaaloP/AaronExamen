import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  displayName: '@aaron-examen/front',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/front',
  testEnvironment: 'jsdom',
};

const jestConfig = createJestConfig(config);

export default async () => {
  const resolved = await jestConfig();

  // Disable SWC path alias resolution — handled by Nx jest resolver.
  if (resolved.transform) {
    for (const value of Object.values(resolved.transform)) {
      if (Array.isArray(value) && value[1] && typeof value[1] === 'object') {
        const transformerConfig = value[1] as { resolvedBaseUrl?: string };
        if (transformerConfig.resolvedBaseUrl !== undefined) {
          value[1] = { ...transformerConfig, resolvedBaseUrl: undefined };
        }
      }
    }
  }

  return resolved;
};
