import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = [
    '.ts'
];

const name = '@shed/ecs';

export default {
    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),

        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'] }),
    ],

    output: [
        {
            file: pkg.main,
            format: 'cjs',
        }
        ,
        {
            file: pkg.module, // same as jsnext:main 
            format: 'esm'
        }
    ],
};