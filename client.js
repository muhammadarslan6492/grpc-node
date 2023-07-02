const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('todo.proto');
const todoProto = grpc.loadPackageDefinition(packageDefinition).Todo;

const client = new todoProto(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

client.createTodo(
  {
    id: -1,
    text: 'Do emails to all companies',
  },
  (err, response) => {
    console.log('Recive from server', JSON.stringify(response));
  }
);

client.readTodos({}, (err, response) => {
  console.log(response);
  console.log('Read from server', JSON.stringify(response));
});

const call = client.readTodosStream();

call.on('data', (item) => {
  console.log('Stream data form sever', JSON.stringify(item));
});

call.on('end', (e) => console.log('server done'));
