const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


//  middleware
// important settings
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// console.log(process.env.DB_USER)
// console.log(process.env.ACCESS_TOKEN_SECRET)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2gzcwih.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// middleware


const logger = async (req, res, next) => {
    console.log('called', req.host, req.originalUrl)
    next();
}

const verifyToken= async (req, res, next)=>{
    const token= req.cookies?.token;
    if(!token){
        return res.status(401).send({message: 'not authorized'})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
if (err){
    return res.status(401).send({message: 'unauthorized'});
}
req.user = decoded;
next()
    })
}


// const verifyToken = async (req, res, next) => {
//     const token = req.cookies?.token;
//     console.log('value of token in middleware', token)
//     if (!token) {
//         return res.status(401).send({ message: 'not authorized' })
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         //error
//         if (err) {
//             return res.status(401).send({ message: 'unauthorized' })
//         }
//         // if token is valid it would be decoded 
//         console.log('value in the token', decoded)
//         req.user = decoded;
//         next()
//     })

// }

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const servicesCollection = client.db('CarDoctor').collection('services');
        const bookingCollection = client.db('CarDoctor').collection('bookings');


        // auth related api / token api

        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                })
                .send({ success: true });
        })


        // all services load by default insert to mongodb
        app.get('/services', logger, async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // api for services id , when just find one 
        app.get('/services/:id', logger, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };

            const result = await servicesCollection.findOne(query, options);
            res.send(result);
        });

        // bookings data

        app.get('/bookings', logger, verifyToken, async (req, res) => {
            // console.log(req.query.email);
            // console.log('token owner info', req.cookies.token)
            console.log('user in the valid token', req.user)
            if(req.user.email !== req.query.email){
                return res.status(403).send({message: 'forbidden access'})
            }
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            // console.log(bookings);
            const result = await bookingCollection.insertOne(bookings);
            res.send(result);
        });

        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedBooking = req.body;
            // console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = bookingCollection.deleteOne(query);
            res.send(result);
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





app.get('/', (req, res) => {
    res.send('car-doctor is running')
})

app.listen(port, () => {
    console.log(`car doctor server is running on port ${port}`)
})