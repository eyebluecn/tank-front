export default function PluginIndent(WangEditor, $) {

	// 用 createMenu 方法创建菜单
	WangEditor.createMenu(function (check) {

		// 定义菜单id，不要和其他菜单id重复。编辑器自带的所有菜单id，可通过『参数配置-自定义菜单』一节查看
		let menuId = 'hr';

		// check将检查菜单配置（『参数配置-自定义菜单』一节描述）中是否该菜单id，如果没有，则忽略下面的代码。
		if (!check(menuId)) {
			return;
		}

		// this 指向 editor 对象自身
		let editor = this;

		// 创建 menu 对象
		let menu = new WangEditor.Menu({
			editor: editor,  // 编辑器对象
			id: menuId,  // 菜单id
			title: '分割线', // 菜单标题

			// 正常状态和选中状态下的dom对象，样式需要自定义
			$domNormal: $('<a href="#" tabindex="-1"><i class="fa fa-minus"></i></a>'),
			$domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="fa fa-minus"></i></a>')
		});

		// 菜单正常状态下，点击将触发该事件
		menu.clickEvent = function (e) {
			// 执行插入的命令
			editor.command(e, 'insertHtml', "<p><hr><br></p>");
		};

		// 菜单选中状态下，点击将触发该事件
		menu.clickEventSelected = function (e) {

			console.log("暂时不做任何事情");
		};

		// 根据当前选区，自定义更新菜单的选中状态或者正常状态
		menu.updateSelectedEvent = function () {
			return false;
		};

		// 增加到editor对象中
		editor.menus[menuId] = menu;
	});

}
