const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 4000;
const stripe = require("stripe")(
  "sk_test_51MRIwySBPcNIjIjbxAltvsXXmfr9E1W9FGWEgUeOPnGIl4QG3gcCuGUOR4p0qH4Bk7g2MSqcK12jMNj6IKnlNSuf00rPTnocU4"
);

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rlwjc14.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const coursesCollection = client
      .db("CourseManagement")
      .collection("Courses");

    console.log("db connected!!!!");

    app.post("/create-payment-intent", async (req, res) => {
      const course = await req.body;
      const price = await course.price;
      const amount = await price*100;
      console.log("Price is: " + price);
      console.log("amount is: " + amount);
      try{
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "inr",
          payment_method_types: ["card"]
        });
        console.log(paymentIntent.client_secret);
        res.send({clientSecret: paymentIntent.client_secret});
      } catch{
        console.log("INSIDE CATCH: ERROR-----");
        res.send({clientSecret: null});
     }
    });

    // automatic_payment_methods: {
    //   enabled: true
    // },

    app.get("/allCourses", async (req, res) => {
      const courses = coursesCollection.find();
      const allCourses = await courses.toArray();
      res.send(allCourses);
    });

    app.get("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const course = await coursesCollection.findOne(query);
      // console.log(course);
      res.send(course);
    });
    
    app.post("/abcd", (req,res) => {
      console.log(req.body);
      res.send({"a":12})
    });

   

  } 
  finally {
    
  
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from WolfAcademy Server Side :)");
});

app.listen(port, () => {
  console.log(`WolfAcademy listening on port ${port}`);
});
