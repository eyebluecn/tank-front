import $ from "jquery";

//check whether an obj is number.
export function smoothScroll(dom) {
	let that = this;
	if (!dom) {
		console.error("使用smoothScroll必须指定dom.");
	}
	$('html, body').animate({
		scrollTop: $(dom).offset().top
	}, 500);

}
