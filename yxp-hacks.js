// import Enumerator from './enumerator.js'
// import { MonoApiHelper } from 'frida-mono-kit'
// // import netstandardModule from './netstandard-module.js'

// // var globalState = {};   // used for Kill Screen

// // var cheatOutput = true; // using "console.log" seems to slow the game down

// (function () {

//     // Enumerator.getAssembly("Common")

//     // -- GAME START -------------------------------------------------------------------
//     // var klass = Enumerator.enumerateClass('LeanCloud.Realtime.Internal.WebSocket.LCWebSocketClient');
//     // if (!klass) return;
//     // console.log("klass:" + " " + klass)
//     // MonoApiHelper.Intercept(klass.address, 'Play_1', {
//     //     onEnter: function (args) {
//     //         console.log("Tween.Play...")
//     //     }
//     // });

//     // var klass = Enumerator.Test("UIManager");

//     var klass = Enumerator.enumerateClass('UIManager');
//     // console.log("klass:" + " " + klass)
//     // if (!klass) return;
//     // MonoApiHelper.Intercept(klass.address, 'Show', {
//     //     onEnter: function (args) {
//     //         console.log("UIManager.Show...")
//     //     }
//     // });
//     // console.log("Intercept suc")
//     // console.log("netstandardModule:");
//     // console.log(netstandardModule);

// })()

console.log("gonna inject");
var injectHackModule = Module.load('/Users/yangwei/Documents/hackYXPmacOS/libinjectHack.dylib');
console.log("gonna injected");
console.log(injectHackModule);
