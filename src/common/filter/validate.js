/**
 * normal regex validation.
 * @type {RegExp}
 */

const ruleRegex = /^(.+?)\[(.+)\]$/;
const numericRegex = /^[0-9]+$/;
const phoneRegex = /^1(3|4|5|7|8)\d{9}$/;
const integerRegex = /^\-?[0-9]+$/;
const decimalRegex = /^\-?[0-9]*\.?[0-9]+$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const alphaRegex = /^[a-z]+$/i;
const alphaNumericRegex = /^[a-z0-9]+$/i;
const alphaDashRegex = /^[a-z0-9_\-]+$/i;
const naturalRegex = /^[0-9]+$/i;
const naturalNoZeroRegex = /^[1-9][0-9]*$/i;
const ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
const base64Regex = /[^a-zA-Z0-9\/\+=]/i;
const numericDashRegex = /^[\d\-\s]+$/;
const urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
const dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;

export function validateEmail(email) {
	return emailRegex.test(email);
}
export function validatePhone(phone) {
	return phoneRegex.test(phone);
}
export function validateNumeric(numeric) {
	return numericRegex.test(numeric);
}
