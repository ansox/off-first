import { replicateRxCollection } from "rxdb/plugins/replication";

// const baseUrl = 'http://127.0.0.1:8787';
const baseUrl =  'https://dbsync.anso.workers.dev';

async function sync(collection, registerError, registerSuccess) {
  const replicationState = await replicateRxCollection({
    collection,
    replicationIdentifier: "sync",
    retryTime: 15000,
    
    pull: {
      async handler(latestPullDocument) {
        const limitPerPull = 10;
            const minTimestamp = latestPullDocument ? latestPullDocument.updatedAt : 0;
            /**
             * In this example we replicate with a remote REST server
             */
            const response = await fetch(
                `${baseUrl}/pull?minUpdatedAt=${minTimestamp}&limit=${limitPerPull}`
            )
            
            const documentsFromRemote = await response.json();
            registerSuccess();
            return {
                /**
                 * Contains the pulled documents from the remote.
                 */
                documents: documentsFromRemote,
                /**
                 * Must be true if there might be more newer changes on the remote.
                 */
                hasMoreDocuments: documentsFromRemote.length === limitPerPull
            };
      }
    },

    push: {
      async handler(docs) {
         const rawResponse = await fetch(`${baseUrl}/push`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ docs })
            })
            .catch(error => {
              if (registerError) {
                registerError(docs);
              }
              throw new Error(error);
            })
            
            // const content = await rawResponse.json();
      }
    },

    batchSize: 5,
  });

  console.log('repli => ', replicationState);
  return replicationState;
}

export default sync;