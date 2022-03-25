const producerSchema = {
  title: 'Producer schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    updatedAt: {
      type: 'number',
    },
    _deleted: {
      type: 'boolean',
    }
  },
  required: ['id', 'name', 'description', 'updatedAt'],
};

export default producerSchema;