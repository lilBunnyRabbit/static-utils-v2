export class DatabaseClient {
  static DB_NAME = "StaticUtilsDatabase";

  public async init() {
    const request = indexedDB.open(DatabaseClient.DB_NAME, 1);

    request.onerror = (event) => {
      // Do something with request.errorCode!
      request.error
    };
    request.onsuccess = (event) => {
      // Do something with request.result!
    };
  }
}