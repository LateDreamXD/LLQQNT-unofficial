## 安装手册

最近我发现还是好多人不会安装啊, 所以我还是写一份安装手册吧 😥  
  
1. 去[发行页](https://github.com/LateDreamXD/LLQQNT-unofficial/releases)下载最新版压缩包
   - 注意: 一般是`LLQQNT-unofficial.zip`  

2. 解压到一个你喜欢的目录并**记住**, 比如`D:\LLQQNT-unofficial`  

3. 打开 qq 安装路径, 一般是`C:\Program Files\Tencent\QQNT`
   - 提示: 如果你不知道 qq 安装路径的话可以在桌面右键 qq 图标并点击打开文件所在位置

4. 进入`versions`目录, 你会看到一个名字类似`9.9.xx-3xxxx`的文件夹, 进入这个文件夹
   然后依次进入`resources`和`app`文件夹, 不出意外的话就能看到我们要霍霍的主角--`package.json`了

5. 打开`package.json`文件, 找到`main`字段, 它应该是这样的:

   ```json
   "main": "./application.asar/app_launcher/index.js",
   ```

   将其改成这样:

   ```json
   "main": "./init.js",
   ```
   - 注意: 别忘记**保存**  

6. 然后我们需要在之前打开的`package.json`的目录下新建一个`init.js`文件, 内容如下:

   ```js
   require(String.raw`D:\LLQQNT-unofficial`);
   ```
   - 注意: 你需要把`D:\LLQQNT-unofficial`改成第2步里你解压的目录
   - 注意: 别忘记**保存**  

7. 此时所有修改操作已经完成, 现在你需要去 [LiteLoaderQQNT/QQNTFileVerifyPatch](https://github.com/LiteLoaderQQNT/QQNTFileVerifyPatch/releases) 下载最新的 DLLHijack(dbghelp_x64.dll) 文件, 将其移动至你的 qq 安装目录下并重命名为`dbghelp.dll`
   - 注意: 别忘记**重命名**  

8. 最后, 重启 qq 并登录, 至此安装完成! 🥳
