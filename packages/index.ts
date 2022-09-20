import FramePlayer from './FramePlayer'

const components = [
	FramePlayer
]

export default {
	// 导出的对象必须具有 install，才能被 Vue.use() 方法安装
	install(app: any) {
		// 遍历注册全局组件
		components.forEach(component => app.component(component.name, component))
	},
	// 以下是具体的组件列表
	FramePlayer
}