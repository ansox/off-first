import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonSection } from '../../components/Button';
import myDb from '../../db/db';
import useForm from '../../infra/hooks/useForm';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
`;

const Label = styled.label`
  margin-top: 20px;
`

const Input = styled.input`
  margin-left: 10px;
`;

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
      <Form onSubmit={form.handleSubmit}>
        <Label>
          Name: 
          <Input name="name" value={form.values.name} onChange={form.handleChange} type="text" />
        </Label>

        <Label>
          Description:
          <Input name="description" value={form.values.description} onChange={form.handleChange} type="text" />
        </Label>

        <ButtonSection>
        
          <Button type="submit" >Salvar</Button>

   
          <Button onClick={() => {
                navigate('/');
              }}>Voltar</Button>
          </ButtonSection>
      </Form>

     


      
    </div>
  )
}

export default ProducerForm;