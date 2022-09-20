import FramePlayer from './src/FramePlayer.vue'

// 为组件提供 install 安装方法，供按需引入
FramePlayer.install = function (app) {
	app.component(FramePlayer.name, FramePlayer)
}

// 默认导出组件
export default FramePlayer