export interface AuthInfo {
    localId: string
    email: string | undefined
    displayName: string
    photoUrl: string | undefined
    emailVerified: boolean
    // providerUserInfo: ProviderUserInfo[]
    validSince: string
    lastLoginAt: string
    createdAt: string
    lastRefreshAt: string
  }
  
//   export interface ProviderUserInfo {
//     providerId: string
//     displayName: string
//     photoUrl: string
//     federatedId: string
//     email: string
//     rawId: string
//   }
  

// export class AuthInfo {
//   uid: string;
//   email: string | undefined;
//   displayName: string;
//   photoUrl: string;
//   validSince: string;
//   lastLoginAt: string;
//   createdAt: string;
//   lastRefreshAt: string;

//   //   constructor(
//   //     uid: string,
//   //     email: string | undefined,
//   //     name: string,
//   //     photoUrl: string,
//   //     validSince: string,
//   //     lastLoginAt: string,
//   //     createdAt: string,
//   //     lastRefreshAt: string,
//   //   ) {
//   //     this.uid = uid;
//   //     this.email = email;
//   //     this.name = name;
//   //     this.photoUrl = photoUrl;
//   //     this.validSince = validSince;
//   //     this.lastLoginAt = lastLoginAt;
//   //     this.createdAt = createdAt;
//   //     this.lastRefreshAt = lastRefreshAt;
//   //   }

// //   constructor(json: any) {
// //     this.uid = json["localId"];
// //     this.email = json["localId"];
// //     this.name = json["localId"];
// //     this.photoUrl = json["localId"];
// //     this.validSince = json["localId"];
// //     this.lastLoginAt = json["localId"];
// //     this.createdAt = json["localId"];
// //     this.lastRefreshAt = json["localId"];
// //   }
// }
