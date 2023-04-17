const express = require("express");
const multer = require("multer");
const { MongoClient } = require("mongodb");
const objectID = require("mongodb").ObjectId;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
const cors = require("cors");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dntu6pu19",
  api_key: "564128523469212",
  api_secret: "4thZsaSpzGS_W4U5CTYvjoCHkxg",
});

// Configure Multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YOUR_CLOUDINARY_FOLDER_NAME",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage: storage });

// Create an Express app and define the upload route
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://AsonsServer:shawon646@cluster0.sfpfh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("EcommercePackage");
    const databaseCar = client.db("CarPackage");
    const productCollection = database.collection("products");
    const blogCollection = database.collection("blog");

    // get product api
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    // get blog
    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();
      res.send(blog);
    });

    app.post("/blog", upload.single("file"), async (req, res) => {
      // Handle the file upload
      const file = req.file;
      const text = req.body.text;
      const post = req.body.post;
      const blog = {
        image: file.path,
        text: text,
        post: post,
      };

      const result = await blogCollection.insertOne(blog);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" car server");
});

// Start the server

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
