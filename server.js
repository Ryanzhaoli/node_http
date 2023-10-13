const http = require("http");

const populateHTML = (headingContent) => {
  return `<h1>${headingContent}</h1>`;
};

http
  .createServer((req, res) => {
    const { url, method } = req;
    const chunks = [];

    req
      .on("error", (error) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(error));
        res.end();
      })
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(chunks).toString();
        const resBody = { url, method, body };

        res.on("error", (error) => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.write(JSON.stringify(error));
          res.end();
        });

        switch(url) {
          case "/":
            res.setHeader("Content-Type", "text/html" );
            res.write(populateHTML("raise the anthem"));
            break;
          case "/about":
            const details = { name: "Ryan", city: "Los Angeles" };
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(details));
            break;
          case "/echo":
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify(resBody));
            break;
          default:
            res.setHeader("Content-Type", "text/html");
            res.write(
              `<h1>Error 404; Page not found. Please try this link... <a href="/">Home</a></h1>`
            );
            break;
        }
        return res.end();
      });
  })
  .listen(3000, () => console.log("Server listening on port 3000"));