// TODO convert this to find a way to get the
// inbound values be that express or something else
// on the inbound use the inbound code to determine if throwing an
// error or not.
// OR if "RAND" is passed use that to pull a random value to decide

const http = require("http");
const server = http.createServer();

server
  .on("request", (request, response) => {
    let body = [];
    request
      .on("data", (chunk) => {
        body.push(chunk);
        body.push("you");
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();

        console.log(`==== ${request.method} ${request.url}`);
        console.log("> Headers");
        console.log(request.headers);

        console.log("> Body");
        console.log(body);
        response.end();
      });
  })
  .listen(3001);
