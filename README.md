# vue-frame-player

vue图片序列帧播放组件，支持通过img/canvas播放，可控制播放速度，可循环播放、倒序播放，设置循环播放及监听事件等功能。

## Demo
https://vmllab-js.github.io/vue-frame-player/

## Installing
Using npm:
```
npm i --save vue-frame-player
```

## Example
html:
```html
<frame-player v-if="config" ref="theFramePlayer" :config="config"/>
```
js:
```javascript
import FramePlayer from 'vue-frame-player'

export default {
    name: 'Home',
    components: {
      FramePlayer
    },
    data() {
      return {
        config: null
      }
    },
    mounted() {
      this.config = {
        imageMode: 'canvas',
        playMode: 'loop',
        length: 40,
        initialImages: ( i, length ) => require( `../assets/bg/${i + 1}.jpg` ),
        fps: 30,
      };
    }
}
```
css:
```scss
.frame-player {
    position: absolute;
    width: 750px;
    height: 1490px;
}
```

## Config Options
| Field         | Type              | Default   | Description                           | 
| ------------- |:-----------------:| :------:  | ------------------------------------  |
| `imageMode`   | `string`          | `visible` | 图片帧显示模式，可选值有unique/visible/opacity/canvas，非必选 |
| `playMode`    | `string`          | `normal`  | 图片帧播放模式，可选值有normal/loop/yoyo，非必选      |
| `frameImages` | `array/function`  | none      | 图片序列数组，`必选`。支持图片地址及base64，可传函数并传length，遍历执行该函数 |
| `length`      | `int`             | none      | 配合frameImages为function的情况，非必选     |
| `fps`         | `int`             | `25`      | 动画播放帧率，非必选        |
| `playStep`    | `int`             | `1`       | 动画播放帧间隔，非必选，不能为0 |
| `playSpeed`   | `float`           | `1`       | 动画播放加速，非必选，可以是负数，不能为0 |
| `preload`     | `boolean`         | `false`   | 动画图片预加载 |
| `autoplay`    | `boolean`         | `false`   | 动画自动播放，如果preload为true，就会等到预加载完成才会自动播放 |

## Methods
可以使用组件的以下方法控制序列图动画：

| Field           | Parameter              | Description                         | 
| --------------- | :--------------------: | ----------------------------------- |
| `play()`        | none                   | 播放序列图动画 |
| `pause()`       | none                   | 暂停播放动画 |
| `stop()`        | none                   | 重置到首帧，停止播放动画 |
| `replay()`      | none                   | 重置到首帧，继续播放动画 |
| `goto()`        | `frame`                | 直接跳到第`n`帧 |
| `on()`          | `eventName`,`callback` | 添加监听事件，可以监听的事件有：play、pause、ended、loop、yoyo、update等 |
| `off()`         | `eventName`,`callback` | 移除监听事件 |
| `set()`         | `attr`, `value`        | 设置参数值，fps、playMode、imageMode、playStep、playSpeed |

```javascript
// example
const player = this.$refs.theFramePlayer;
player
.on('play', () => console.log('frame player played!'))
.on('pause', () => console.log('frame player paused!'))
.on('ended', () => console.log('frame player ended!'))
.on('update', (current) => console.log('frame player update frame ', current))
.play()
```

## Author
VML-LAB RhineLiu