const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rlwjc14.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1 });

async function run(){
try {
  await client.connect();

  const coursesCollection = client.db('CourseManagement').collection('Courses');

  console.log("db connected!!!!");

  app.get('/allCourses', async (req, res) =>{
    const courses = coursesCollection.find();
    const allCourses = await courses.toArray();
    res.send(allCourses);
  })
}
finally{

}
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello from WolfAcademy Server Side :)");
  });

  app.listen(port, () => {
    console.log(`WolfAcademy listening on port ${port}`);
  });