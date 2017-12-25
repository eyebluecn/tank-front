export default function PluginIndent(WangEditor, $) {

	// 用 createMenu 方法创建菜单
	WangEditor.createMenu(function (check) {

		let menuId = 'nbalignleft';
		if (!check(menuId)) {
			return;
		}
		let editor = this;

		// 创建 menu 对象
		let menu = new WangEditor.Menu({
			editor: editor,
			id: menuId,
			title: "左对齐",

			// 正常状态和选中状态下的dom对象，样式需要自定义
			$domNormal: $('<a href="#" tabindex="-1"><i class="fa fa-align-left"></i></a>'),
			$domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="fa fa-align-left"></i></a>')
		});


		// 菜单正常状态下，点击将触发该事件
		menu.clickEvent = function (e) {
			// 找到当前选区所在的 p 元素
			let elem = editor.getRangeElem();
			let p = editor.getSelfOrParentByName(elem, 'p');
			let $p;

			if (!p) {
				// 未找到 p 元素，则忽略
				return e.preventDefault();
			}
			$p = $(p);

			// 使用自定义命令
			function commandFn() {
				$p.css('text-align', 'left');
			}

			editor.customCommand(e, commandFn);

			// onchange 事件
			if (editor.onchange && typeof editor.onchange === 'function') {
				editor.onchange.call(editor);
			}
		};

		// 菜单选中状态下，点击将触发该事件
		menu.clickEventSelected = function (e) {
			// 找到当前选区所在的 p 元素
			let elem = editor.getRangeElem();
			let p = editor.getSelfOrParentByName(elem, 'p');
			let $p;

			if (!p) {
				// 未找到 p 元素，则忽略
				return e.preventDefault();
			}
			$p = $(p);

			// 使用自定义命令
			function commandFn() {
				$p.css('text-align', 'inherit');
			}

			editor.customCommand(e, commandFn);

			// onchange 事件
			if (editor.onchange && typeof editor.onchange === 'function') {
				editor.onchange.call(editor);
			}
		};


		// 定义 update selected 事件
		menu.updateSelectedEvent = function () {
			let rangeElem = editor.getRangeElem();
			rangeElem = editor.getSelfOrParentByName(rangeElem, 'p,h1,h2,h3,h4,h5,li', function (elem) {
				let cssText;
				if (elem && elem.style && elem.style.cssText != null) {
					cssText = elem.style.cssText;
					if (cssText && /text-align:\s*left;/.test(cssText)) {
						return true;
					}
				}
				if ($(elem).attr('align') === 'left') {
					// ff 中，设置align-center之后，会是 <p align="center">xxx</p>
					return true;
				}
				return false;
			});
			if (rangeElem) {
				return true;
			}
			return false;
		};





		// 增加到editor对象中
		editor.menus[menuId] = menu;
	});

}
