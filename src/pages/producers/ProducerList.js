import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, ButtonSection } from '../../components/Button';

import myDb from '../../db/db';
import sync from '../../db/sync';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

Table.Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`

Table.Tr = styled.tr`
  tr:nth-child(even){background-color: #f2f2f2;}
`;

Table.Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
   padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
`

function ProducerList() {
  const navigate = useNavigate();

  const [producers, setProducers] = React.useState([]);
  const [producersCollection, setProducersCollection] = React.useState(null);
  const [replicationState, setReplicationState] = React.useState(null);
  const [notSync, setNotSync] = React.useState(false);
  const [dataToSync, setDataToSync] = React.useState([]);

  let sub;

  async function initPage() {
    const db = await myDb.initDB();
    const collection =  db.producers;
    setProducersCollection(collection);
    const query = collection.find();

   setReplicationState(await sync(collection, (documents) => {
     setNotSync(documents.length > 0);

     setDataToSync(documents);
     console.log('Not sync =>', documents);
   }, () => {
     setNotSync(false);
      setDataToSync([]);
   }));

    sub = query.$.subscribe(results => {

      setProducers(results);
    })

  
  }

  async function syncProducers() {
      // emits each document that was recieved from the remote
    replicationState.received$.subscribe(doc => console.log('Received => ', doc));

// emits each document that was send to the remote
    replicationState.send$.subscribe(doc => console.log('Send => ', doc));

// emits all errors that happen when running the push- & pull-handlers.
    replicationState.error$.subscribe(error => console.log('Error =>', error));

// emits true when the replication was canceled, false when not.
    replicationState.canceled$.subscribe(bool => console.log('Canceled => ', bool));

// emits true when a replication cycle is running, false when not.
    replicationState.active$.subscribe(bool => console.log('Active =>', bool));

    replicationState.run();
  }
  
  React.useEffect(() => {
    initPage();

    return () => {
      sub.unsubscribe();
    }
  }, []);

  return (
    <div>
      <Table>
        <thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
          </Table.Tr>
        </thead>
        <tbody>
          
            {
              producers?.map(producer => (
                <Table.Tr>
                  <Table.Td>{producer.name}</Table.Td>
                  <Table.Td>{producer.description}</Table.Td>
                </Table.Tr>
              ))
            }
           
        </tbody>
      </Table>
      <ButtonSection>
        <Button onClick={() => {
          navigate('/producer-form');
        }}>Insert</Button>
        <Button onClick={syncProducers}>Sync</Button>
      </ButtonSection>
     

      {notSync && <div>
        <p>Not sync</p>
        <p>Total Data: {dataToSync.length}</p>

        {
          dataToSync.map(data => (
            <p>{data.name}</p>
          ))
        }
      </div>}
    </div>
  );
}

export default ProducerList;  