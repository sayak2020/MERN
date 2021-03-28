require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL,  { useUnifiedTopology: true , useNewUrlParser: true}); //subscribers name of database
const db = mongoose.connection;
db.on('error', (error) => { console.error(error)});
db.once('open', () => { console.log('Connected to database')});



//const uri = 
// mongoose.connect(process.env.DATABASE_URL_G, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log('MongoDB Connected…')
// })
// .catch(err => console.log(err))

//const db = mongoose.connection;
//db.on('error', (error) => { console.error(error)});
//db.once('open', () => { console.log('Connected to database')});

app.use(express.json());

const subscribersRouter = require('./routes/subscribers');
//app.use(app.router);  Deparcated in new version of node
//subscribersRouter.initialize(app);
app.use('/subscribers', subscribersRouter); //localhost://3000/subscribers/x/xy/xtz every thing after suubscriber comes in this category


const userRouter = require('./routes/login');
app.use('/login', userRouter);

app.listen(3000, () => {
    console.log('Server startded at 3000');
});