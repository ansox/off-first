import { createRxDatabase } from 'rxdb';

import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import producerSchema from './producer-schema';

addPouchPlugin(require('pouchdb-adapter-idb'));

const myDb = {
  db: null,

  initDB: async function () {
    if (!this.db) {
      this.db = await createRxDatabase({
        name: 'caddb',
        storage: getRxStoragePouch('idb'),
        multiInstance: false,
      });

      await this.db.addCollections({
        producers: {
          schema: producerSchema
        }
      });
    }

    return this.db;
  }
}



export default myDb;
