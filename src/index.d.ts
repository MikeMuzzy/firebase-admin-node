/*!
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Bucket} from '@google-cloud/storage';
import * as _firestore from '@google-cloud/firestore';

declare namespace admin {
  interface FirebaseError {
    code: string;
    message: string;
    stack: string;

    toJSON(): Object;
  }

  type FirebaseArrayIndexError = {
    index: number;
    error: FirebaseError;
  }

  interface ServiceAccount {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  }

  interface GoogleOAuthAccessToken {
    access_token: string;
    expires_in: number;
  }

  interface AppOptions {
    credential?: admin.credential.Credential;
    databaseAuthVariableOverride?: Object;
    databaseURL?: string;
    storageBucket?: string;
  }

  var SDK_VERSION: string;
  var apps: (admin.app.App|null)[];

  function app(name?: string): admin.app.App;
  function auth(app?: admin.app.App): admin.auth.Auth;
  function database(app?: admin.app.App): admin.database.Database;
  function messaging(app?: admin.app.App): admin.messaging.Messaging;
  function storage(app?: admin.app.App): admin.storage.Storage;
  function firestore(app?: admin.app.App): admin.firestore.Firestore;
  function initializeApp(options: admin.AppOptions, name?: string): admin.app.App;
}

declare namespace admin.app {
  interface App {
    name: string;
    options: admin.AppOptions;

    auth(): admin.auth.Auth;
    database(): admin.database.Database;
    firestore(): admin.firestore.Firestore;
    messaging(): admin.messaging.Messaging;
    storage(): admin.storage.Storage;
    delete(): Promise<void>;
  }
}

declare namespace admin.auth {
  interface UserMetadata {
    lastSignInTime: string;
    creationTime: string;

    toJSON(): Object;
  }

  interface UserInfo {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    providerId: string;

    toJSON(): Object;
  }

  interface UserRecord {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    phoneNumber: string;
    photoURL: string;
    disabled: boolean;
    metadata: admin.auth.UserMetadata;
    providerData: admin.auth.UserInfo[];
    passwordHash?: string;
    passwordSalt?: string;
    customClaims?: Object;

    toJSON(): Object;
  }

  interface UpdateRequest {
    displayName?: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    photoURL?: string;
    disabled?: boolean;
    password?: string;
  }

  interface CreateRequest extends UpdateRequest {
    uid?: string;
  }

  interface DecodedIdToken {
    aud: string;
    auth_time: number;
    exp: number;
    firebase: {
      identities: {
        [key: string]: any;
      };
      sign_in_provider: string;
      [key: string]: any;
    };
    iat: number;
    iss: string;
    sub: string;
    uid: string;
    [key: string]: any;
  }

  interface ListUsersResult {
    users: admin.auth.UserRecord[];
    pageToken?: string;
  }

  interface Auth {
    app: admin.app.App;

    createCustomToken(uid: string, developerClaims?: Object): Promise<string>;
    createUser(properties: admin.auth.CreateRequest): Promise<admin.auth.UserRecord>;
    deleteUser(uid: string): Promise<void>;
    getUser(uid: string): Promise<admin.auth.UserRecord>;
    getUserByEmail(email: string): Promise<admin.auth.UserRecord>;
    getUserByPhoneNumber(phoneNumber: string): Promise<admin.auth.UserRecord>;
    listUsers(maxResults?: number, pageToken?: string): Promise<admin.auth.ListUsersResult>;
    updateUser(uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord>;
    verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken>;
    setCustomUserClaims(uid: string, customUserClaims: Object): Promise<void>;
  }
}

declare namespace admin.credential {
  interface Credential {
    getAccessToken(): Promise<admin.GoogleOAuthAccessToken>;
  }

  function applicationDefault(): admin.credential.Credential;
  function cert(serviceAccountPathOrObject: string|admin.ServiceAccount): admin.credential.Credential;
  function refreshToken(refreshTokenPathOrObject: string|Object): admin.credential.Credential;
}

declare namespace admin.database {
  interface Database {
    app: admin.app.App;

    goOffline(): void;
    goOnline(): void;
    ref(path?: string): admin.database.Reference;
    refFromURL(url: string): admin.database.Reference;
  }

  interface DataSnapshot {
    key: string|null;
    ref: admin.database.Reference;

    child(path: string): admin.database.DataSnapshot;
    exists(): boolean;
    exportVal(): any;
    forEach(action: (a: admin.database.DataSnapshot) => boolean): boolean;
    getPriority(): string|number|null;
    hasChild(path: string): boolean;
    hasChildren(): boolean;
    numChildren(): number;
    toJSON(): Object;
    val(): any;
  }

  interface OnDisconnect {
    cancel(onComplete?: (a: Error|null) => any): Promise<void>;
    remove(onComplete?: (a: Error|null) => any): Promise<void>;
    set(value: any, onComplete?: (a: Error|null) => any): Promise<void>;
    setWithPriority(
      value: any,
      priority: number|string|null,
      onComplete?: (a: Error|null) => any
    ): Promise<void>;
    update(values: Object, onComplete?: (a: Error|null) => any): Promise<void>;
  }

  type EventType = 'value' | 'child_added' | 'child_changed' | 'child_moved' | 'child_removed';
  interface Query {
    ref: admin.database.Reference;

    endAt(value: number|string|boolean|null, key?: string): admin.database.Query;
    equalTo(value: number|string|boolean|null, key?: string): admin.database.Query;
    isEqual(other: admin.database.Query|null): boolean;
    limitToFirst(limit: number): admin.database.Query;
    limitToLast(limit: number): admin.database.Query;
    off(
      eventType?: admin.database.EventType,
      callback?: (a: admin.database.DataSnapshot, b?: string|null) => any,
      context?: Object|null
    ): void;
    on(
      eventType: admin.database.EventType,
      callback: (a: admin.database.DataSnapshot|null, b?: string) => any,
      cancelCallbackOrContext?: Object|null,
      context?: Object|null
    ): (a: admin.database.DataSnapshot|null, b?: string) => any;
    once(
      eventType: admin.database.EventType,
      successCallback?: (a: admin.database.DataSnapshot, b?: string) => any,
      failureCallbackOrContext?: Object|null,
      context?: Object|null
    ): Promise<any>;
    orderByChild(path: string): admin.database.Query;
    orderByKey(): admin.database.Query;
    orderByPriority(): admin.database.Query;
    orderByValue(): admin.database.Query;
    startAt(value: number|string|boolean|null, key?: string): admin.database.Query;
    toJSON(): Object;
    toString(): string;
  }

  interface Reference extends admin.database.Query {
    key: string|null;
    parent: admin.database.Reference|null;
    root: admin.database.Reference;

    child(path: string): admin.database.Reference;
    onDisconnect(): admin.database.OnDisconnect;
    push(value?: any, onComplete?: (a: Error|null) => any): admin.database.ThenableReference;
    remove(onComplete?: (a: Error|null) => any): Promise<void>;
    set(value: any, onComplete?: (a: Error|null) => any): Promise<void>;
    setPriority(
      priority: string|number|null,
      onComplete: (a: Error|null) => any
    ): Promise<void>;
    setWithPriority(
      newVal: any, newPriority: string|number|null,
      onComplete?: (a: Error|null) => any
    ): Promise<void>;
    transaction(
      transactionUpdate: (a: any) => any,
      onComplete?: (a: Error|null, b: boolean, c: admin.database.DataSnapshot|null) => any,
      applyLocally?: boolean
    ): Promise<{
      committed: boolean,
      snapshot: admin.database.DataSnapshot|null
    }>;
    update(values: Object, onComplete?: (a: Error|null) => any): Promise<void>;
  }

  interface ThenableReference extends admin.database.Reference, Promise<any> {}

  function enableLogging(logger?: boolean|((message: string) => any), persistent?: boolean): any;
}

declare namespace admin.database.ServerValue {
  var TIMESTAMP: number;
}

declare namespace admin.messaging {
  type DataMessagePayload = {
    [key: string]: string;
  };

  type NotificationMessagePayload = {
    tag?: string;
    body?: string;
    icon?: string;
    badge?: string;
    color?: string;
    sound?: string;
    title?: string;
    bodyLocKey?: string;
    bodyLocArgs?: string;
    clickAction?: string;
    titleLocKey?: string;
    titleLocArgs?: string;
    [key: string]: string | undefined;
  };

  type MessagingPayload = {
    data?: admin.messaging.DataMessagePayload;
    notification?: admin.messaging.NotificationMessagePayload;
  };

  type MessagingOptions = {
    dryRun?: boolean;
    priority?: string;
    timeToLive?: number;
    collapseKey?: string;
    mutableContent?: boolean;
    contentAvailable?: boolean;
    restrictedPackageName?: string;
    [key: string]: any | undefined;
  };

  type MessagingDeviceResult = {
    error?: admin.FirebaseError;
    messageId?: string;
    canonicalRegistrationToken?: string;
  };

  type MessagingDevicesResponse = {
    canonicalRegistrationTokenCount: number;
    failureCount: number;
    multicastId: number;
    results: admin.messaging.MessagingDeviceResult[];
    successCount: number;
  };

  type MessagingDeviceGroupResponse = {
    successCount: number;
    failureCount: number;
    failedRegistrationTokens: string[];
  };

  type MessagingTopicResponse = {
    messageId: number;
  };

  type MessagingConditionResponse = {
    messageId: number;
  };

  type MessagingTopicManagementResponse = {
    failureCount: number;
    successCount: number;
    errors: admin.FirebaseArrayIndexError[];
  };

  interface Messaging {
    app: admin.app.App;

    sendToDevice(
      registrationToken: string | string[],
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingDevicesResponse>;
    sendToDeviceGroup(
      notificationKey: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingDeviceGroupResponse>;
    sendToTopic(
      topic: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingTopicResponse>;
    sendToCondition(
      condition: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingConditionResponse>;
    subscribeToTopic(
      registrationToken: string,
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;
    subscribeToTopic(
      registrationTokens: string[],
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;
    unsubscribeFromTopic(
      registrationToken: string,
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;
    unsubscribeFromTopic(
      registrationTokens: string[],
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;
  }
}

declare namespace admin.storage {
  interface Storage {
    app: admin.app.App;
    bucket(name?: string): Bucket;
  }
}

declare namespace admin.firestore {
  export import FieldPath = _firestore.FieldPath;
  export import FieldValue = _firestore.FieldValue;
  export import Firestore = _firestore.Firestore;
  export import GeoPoint = _firestore.GeoPoint;
  export import setLogFunction = _firestore.setLogFunction;
}

declare module 'firebase-admin' {
}

export = admin;
