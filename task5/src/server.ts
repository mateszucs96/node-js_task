import http from 'http';

const PORT = process.env.PORT || 8000;

const server = http.createServer(async (req, res) => {
  // implementation here
  // for local development use "npm run start:dev" command
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
