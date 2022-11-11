const fs = require("fs");
const { createServer } = require("http");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate');


/////////////////////////////////////
//////Files
//blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado ${textIn}\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written')

//nonblocking, synchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data) => {
//         console.log(data);
//         fs.writeFile('./txt/final.txt',`${data2}\n${data}`, 'utf-8', err => {
//             console.log('your file has been written');
//         });
//       });
//   });
// });
// console.log("reading file");

/////////////////////////////////////
//////Server



const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //product page
  } else if (pathname === "/product") {
    const product =dataObj[query.id];
    console.log(product);
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product)
    res.end(output);

    //API
  } else if (pathname == "/api") {
    res.writeHead(404, {
      "Content-type": "application/json",
    });
    res.end(data);

    //Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000");
});
