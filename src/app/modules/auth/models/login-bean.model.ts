export class LoginBeanModel {
  requestedTime: number;
  referenceId: any;
  clientUserName: string;
  clientPassword: string;
  channelId: number;
  loginId: string;
  cpin: string;

  constructor(username: string, password: string) {
    this.requestedTime = Date.now();
    this.referenceId = null;
    this.clientUserName = '';
    this.clientPassword = '';
    this.channelId = 2001;
    this.loginId = username;
    this.cpin = password;
  }
}
