export class AuthInfo {
  uid: string;
  email: string | undefined;
  name: string | undefined;
  photoUrl: string | undefined;
  validSince: string | undefined;
  lastLoginAt: string | undefined;
  createdAt: string | undefined;
  lastRefreshAt: string | undefined;

  //   constructor(
  //     uid: string,
  //     email: string | undefined,
  //     name: string,
  //     photoUrl: string,
  //     validSince: string,
  //     lastLoginAt: string,
  //     createdAt: string,
  //     lastRefreshAt: string,
  //   ) {
  //     this.uid = uid;
  //     this.email = email;
  //     this.name = name;
  //     this.photoUrl = photoUrl;
  //     this.validSince = validSince;
  //     this.lastLoginAt = lastLoginAt;
  //     this.createdAt = createdAt;
  //     this.lastRefreshAt = lastRefreshAt;
  //   }

  constructor(json: Record<string, string>) {
    this.uid = json["localId"];
    this.email = json["email"];
    this.name = json["displayName"];
    this.photoUrl = json["photoUrl"];
    this.validSince = json["validSince"];
    this.lastLoginAt = json["lastLoginAt"];
    this.createdAt = json["createdAt"];
    this.lastRefreshAt = json["lastRefreshAt"];
  }
}