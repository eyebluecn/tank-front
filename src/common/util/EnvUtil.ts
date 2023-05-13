export default class EnvUtil {
  static currentHost() {
    return window.location.protocol + '//' + window.location.host;
  }
}
