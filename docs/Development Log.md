# Development Log

## 2023-10-11

由于 弈仙牌 用了 [ILRuntime](https://ourpalm.github.io/ILRuntime/public/v1/guide/index.html)。所以要研究下怎么去反编译项目的 ILRuntime 代码。

### 在哪？

**项目的 ILRuntime 代码一般放在哪？**

[地址](https://ourpalm.github.io/ILRuntime/public/v1/guide/tutorial.html#开始使用)
>这个例子为了演示方便，直接从StreamingAssets目录里读取了脚本DLL文件以及调试符号PDB文件， 实际发布的时候，如果要热更，肯定是将DLL和PDB文件打包到Assetbundle中进行动态加载的，这个不是ILRuntime的范畴，故不具体演示了。

**通过 ilspy 看到了这些代码**

能看到 Assembly-CSharp.dll 中用了 ILRuntime。

![img](https://img2023.cnblogs.com/blog/1663727/202310/1663727-20231011223905099-1893500388.png)

其中 ILRuntime.Runtime.Generated 中跟游戏逻辑比较相关的有.

![img](https://img2023.cnblogs.com/blog/1663727/202310/1663727-20231011223751636-598691723.png)

回到正题，关于怎么找到项目的 ILRuntime代码。
关注 Assembly-CSharp.dll 的 ILRManager类，有：

```csharp
s_AppDomain = new ILRuntime.Runtime.Enviorment.AppDomain();
object value = s_AppDomain.GetType().GetField("jitWorker", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(s_AppDomain);
((Thread)value.GetType().GetField("thread", BindingFlags.Instance | BindingFlags.NonPublic).GetValue(value)).IsBackground = true;
s_AssemblyStream = new MemoryStream((await Addressables.LoadAssetAsync<TextAsset>("DarkSun.HotUpdate").Task).bytes);
s_AppDomain.LoadAssembly(s_AssemblyStream);
RegisterAppDomain(s_AppDomain);
CLRBindingUtils.Initialize(s_AppDomain);
Debug.Log("ILRuntime初始化成功");
ILRApp.Init(s_AppDomain);
Observable.OnceApplicationQuit().Subscribe(delegate
{
    UnInit();
});
```

这里有

```csharp
await Addressables.LoadAssetAsync<TextAsset>("DarkSun.HotUpdate")
```

能知道：
1. 使用了 `Addressables`
2. ILRuntime项目代码被编译到了 `DarkSun.HotUpdate` 中。

于是我们有新问题。

### Addressables 下载的文件在哪？

[Addressables文档](https://docs.unity3d.com/Packages/com.unity.addressables@1.16/manual/index.html)


**怎么列出所有的 Image**

发现一个很合适的[写法参考](https://tomorrowisnew.com/posts/Hacking-Mono-Games-With-Frida/)

```js
MonoApiHelper.AssemblyForeach(function (assemb) {
    var image = MonoApi.mono_assembly_get_image(assemb);
    var image_name = MonoApi.mono_image_get_name(image);
    console.log(image_name)
    console.log(image_name.readUtf8String())
    console.log("------");
    return 1;
});
```

关键：`image_name.readUtf8String()`

## 2023-10-12

在 `enumerator.js` 中的 `getMethods` 方法中：

```
jit_address: '0x' + parseInt(MonoApi.mono_compile_method(method)).toString(16)
```

frida 在执行 `MonoApi.mono_compile_method(method)` 时会卡住，然后稍等一会后打印：

```
Failed to load script: timeout was reached
```

相关：

[ONE](https://github.com/frida/frida/issues/752)

使用 `setImmediate` (ObjC)

![img](https://img2023.cnblogs.com/blog/1663727/202310/1663727-20231012212302382-1594789050.png)

[TWO](https://github.com/frida/frida/issues/113)

使用 `setTimeout`

主要表述：要避免在 script 中使用比较耗时的方法。

这样子测试了：

```js
  Test: function (name) {
    var klass = this.getClass(name);
    if (klass == 0) {
      console.log('Class "' + name + '" not found.');
      return null;
    }
    var methods = MonoApiHelper.ClassGetMethods(klass);
    var asyncRunner = new AsyncRunner();
    for (const method of methods) {
      asyncRunner.Then((c) => {
        setTimeout(() => {
          var name = MonoApiHelper.MethodGetName(method);
          var jit_address = '0x' + parseInt(MonoApi.mono_compile_method(method)).toString(16);
          console.log(name + " " + jit_address);
          c();
        }, 10)
      })
    }
    asyncRunner.Start(() => {
      console.log("All Done");
    });
  },
```

还是不行。

研究了下 `frida-mono-api` 的作者的重构项目 `frida-mono`（[仓库地址](https://github.com/freehuntx/frida-mono/tree/feature/v1)）

在新项目中也有不使用 `mono_compile_method` 的获取类的方法的方式。

```js
MonoApi.mono_class_get_method_from_name(monoClass, Memory.allocUtf8String(name), -1)
```


-----

一堆的 frida 脚本片段代码

https://github.com/iddoeldor/frida-snippets/blob/master/README.md


## 2023-10-18

Todo: 
1. Get "Type" from netstandard.dll [X]
2. Get Type from image `netstandard`
3. 
4. Run "Type.GetType()"

