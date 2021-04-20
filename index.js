const express=require( 'express');
const bodyParser=require('body-parser');
const cors =require('cors');
const ObjectId=require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const app =express();
app.use(express.json());
app.use(cors());
const port=5000 ;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ca1km.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("DigitalAgency").collection("Services");
  const reviewCollection = client.db("DigitalAgency").collection("Review");
  const OrderListCollection = client.db("DigitalAgency").collection("OrderList");
  const adminCollection = client.db("DigitalAgency").collection("Admin");
  
  


  app.post('/addService', (req,res) => {
    const services =req.body;
    console.log(services);
    serviceCollection.insertOne(services)
      .then (result => {

          console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
    
    })

    app.post('/addOrder', (req,res) => {
      const order =req.body;
      console.log(order);
      OrderListCollection.insertOne(order)
        .then (result => {
  
            console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
        })
      
      })

    app.post('/makeAdmin', (req,res) => {
      const admin =req.body;
      console.log(admin);
      adminCollection.insertOne(admin)
        .then (result => {
  
            console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
        })
      
      })
    
  app.post('/addReview', (req,res) => {
    const Review =req.body;
    console.log(Review);
    reviewCollection.insertOne(Review)
      .then (result => {

          console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
    
    })


    app.get('/Review',(req,res)=>{
      reviewCollection.find()
      .toArray((err,items) =>{
        res.send(items)
        console.log('from database',items);
      })
    })

    app.get('/serviceList',(req,res)=>{
      OrderListCollection.find()
      .toArray((err,items) =>{
        res.send(items)
        console.log('from database',items);
      })
    })

//Client Review show ui
    app.get('/Services',(req,res)=>{
      serviceCollection.find()
      .toArray((err,items) =>{
        res.send(items)
        console.log('from database',items);
      })
    })


    app.get('/Services/:id',(req,res)=>{
      serviceCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err,items) =>{
        res.send(items)
        console.log('from database',items);
      })
    })




    app.get('/orders',(req,res)=>{
      const qEmail = req.query.email;
      OrderListCollection.find({ email: qEmail })
      .toArray((err,documents) =>{
        res.send(documents)
        console.log('from database',documents);
      })
    })


    app.get('/getAdmin',(req,res)=>{
      const qEmail = req.query.email;
      adminCollection.find({ email: qEmail })
      .toArray((err,documents) =>{
        res.send(documents)
        console.log('from database',documents);
      })
    })

    //delete Service

    app.delete('/deleteService/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      serviceCollection.deleteOne({ _id: id })
         .then((result) => {
           console.log(result);
             res.send(result.deletedCount > 0)
         })
    })

});


app.get('/',(req,res) => {
    res.send('data base working')
})

app.listen(process.env.PORT || port)