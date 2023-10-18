const KNOWN_RUNTIMES = ['netstandard.dll'];
// const KNOWN_EXPORTS = ['mono_thread_attach'];

let netstandardModule = null;

// Look for a known runtime module.
for (let x of KNOWN_RUNTIMES) {
    let module = Process.findModuleByName(x);
    if (module) {
        netstandardModule = module;
        break;
    }
}

// Look for a known mono export.
if (!netstandardModule) throw new Error('Can\'t find netstandard runtime!')

export default netstandardModule
