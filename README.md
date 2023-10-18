Progress: ░░░░░░░░░░ 0%

# HackYXPMacOS

本项目尝试在 MacOs （为了写插件做准备）破解弈仙牌。

This project is focus on hack "Yi Xian: The Cultivation Card Game" on macOs running on an M1/M2 cpu.

# Setup

Any Node.js version that is able to use [Rollup](https://rollupjs.org) should work.

0. Follow the [documentation](https://frida.re/docs/installation/) and install `frida-cli`.
1. Install [Rollup](https://rollupjs.org) globally.
   * Run the command `npm install --global rollup`.
2. Clone this repository.
3. Open your terminal, navigate to this repository, and run `npm install` to install the required node_modules.

## Why `Rollup`

We use frida-cli like this: `frida xx.exe -l xx.js`. However, it can't deal with `import` and `require` statements inside `xx.js`. Therefore, we need a tool to bundle the `xx.js` file along with all its dependencies into a single file, and that's exactly what `Rollup` is designed for.


# Hack

First:

```bah
npm run rollup
```

Then:

```bash
npm run inject
```