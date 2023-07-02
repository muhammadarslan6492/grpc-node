const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('todo.proto');
const todoProto = grpc.loadPackageDefinition(packageDefinition).Todo;

const todos = [];
const todofunctionsObject = {
  createTodo: (call, callback) => {
    const todoItem = {
      id: todos.length + 1,
      text: call.request.text,
    };
    todos.push(todoItem);
    callback(null, todoItem);
  },
  readTodos: (call, callback) => {
    callback(null, { items: todos });
  },
  readTodosStream: (call, callback) => {
    todos.forEach((t) => call.write(t));
    call.end();
  },
};

const server = new grpc.Server();
server.addService(todoProto.service, todofunctionsObject);
server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start server:', error);
    } else {
      console.log('Server started, listening on port', port);
      server.start();
    }
  }
);
