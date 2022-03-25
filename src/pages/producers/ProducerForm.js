import React from 'react';
import { useNavigate } from 'react-router-dom';
import myDb from '../../db/db';
import useForm from '../../infra/hooks/useForm';

function ProducerForm() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: '',
      description: ''
    },
    onSubmit: async (values) => {
      console.log(values);
      
      const db = await myDb.initDB();
      const producersCollection = db.producers;
      producersCollection.insert({
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: Date.now(),
        _deleted: false,
      });
      navigate('/');

    }
  });

  return (
    <div>
      <h1>ProducerForm</h1>
      <form onSubmit={form.handleSubmit}>
        <label>
          Name:
          <input name="name" value={form.values.name} onChange={form.handleChange} type="text" />
        </label>

        <label>
          Description:
          <input name="description" value={form.values.description} onChange={form.handleChange} type="text" />
        </label>
         <button type="submit" >Salvar</button>
      </form>
     
      <button onClick={() => {
        navigate('/');
      }}>Voltar</button>
    </div>
  )
}

export default ProducerForm;