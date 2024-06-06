const express= require(`express`);
// const cors = require=('cors');
const cors = require('cors'); 
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app =express();
const port =process.env.PORT || 5000;

// middelware 
app.use(cors());
app.use(express.json());

// 1fevI432qYkfRZRP
// coffeeMaster

// console.log(process.env.DB_USER);

// console.log(process.env.DB_PASS);


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gieptu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 console.log(uri);
// const uri = "mongodb+srv://coffeeMaster:1fevI432qYkfRZRP@cluster0.1gieptu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {



  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

 const coffeecollection = client.db("coffeeDB").collection("coffee");
 const usercollection = client.db("coffeeDB").collection("user");
 // server er kaj ja shob aikhane kora lagbe 

// Create
app.post('/coffee' , async(req, res)=>{
    // client body form req
 const newCoffee=req.body;

 console.log(newCoffee);
 const result = await coffeecollection.insertOne(newCoffee);
 res.send(result);
})


// read

app.get('/coffee' , async(req, res)=>{
  
    const cursor = coffeecollection.find();

    const result = await cursor.toArray();
    res.send(result);
   })

// edit 


app.get('/coffee/:id',async(req, res)=>{
  const id=req.params.id
  const filter = {_id: new ObjectId(id) };

  const edit= await coffeecollection.findOne(filter);
 res.send(edit)
 

})

//  route Update.jsx file upore age edit kora hoice trpor  update

app.put('/coffee/:id',async (req ,res)=>{
 const id= req.params.id
   const filter = { _id: new ObjectId(id) };
   const options = { upsert: true };
   const updatecoffee=req.body;
   const coffee = {
    $set: {
     name:updatecoffee.name,
     chef:updatecoffee.chef,
     supplier:updatecoffee.supplier,
     taste:updatecoffee.taste,
     category:updatecoffee.category,
     details:updatecoffee.details,
     photo:updatecoffee.photo,

    },
   
  }
  const result = await coffeecollection.updateOne(filter, coffee, options);
  res.send(result)
})




// Delete
app.delete('/coffee/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeecollection.deleteOne(query);
      req.send(result);
      if (result.deletedCount === 1) {
        res.status(200).send({ message: 'Coffee deleted successfully' });
      } else {
        res.status(404).send({ message: 'Coffee not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'An error occurred', error });
    }
   
  });


  // auth user firebase user insert db 

  // create user auth
  app.post('/user' , async(req, res)=>{
    // client body form req
 const user=req.body;

 console.log(user);
 const result = await usercollection.insertOne(user);
 res.send(result);
})


// read user auth

app.get('/user' , async(req, res)=>{
  
  const cursor = usercollection.find();
  const result = await cursor.toArray();
  res.send(result);
 })

//  Delete user Auth
app.delete('/user/:id', async (req, res) => {

    const id = req.params.id;
    const query = {_id: new ObjectId(id) };
    const result = await usercollection.deleteOne(query);
    res.send(result);
})
// user singup same email login then update lastSignInTime database 
app.patch('/user', async (req ,res)=>{
  const user= req.body;
    const filter = {email: user.email }
    const updateDoc= {
      $set: {
        lastLoggedAt: user.lastLoggedAt
       
  
      }
    }
    const result = await usercollection.updateOne(filter,updateDoc);
    res.send(result)
})
 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// server ta chlolche kina ta dekte hobe 
app.get('/' ,(req,res)=>{
    res.send('cofffe making server is runninfg');
})

app.listen(port,()=>{

    console.log(` Coffee simple crud oparatrion ${port}`);
})