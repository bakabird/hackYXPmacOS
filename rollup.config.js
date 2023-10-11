import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'yxp-hacks.js',
    output: {
        file: "yxp-hacks.bundle.js",
        format: 'iife'
    },
    plugins: [nodeResolve()]
};