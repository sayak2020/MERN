const express = require('express');
//const subscriber = require('../models/Subscriber');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

//Getting all
router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.find();
        res.json(subscribers);

    } catch (err) {
        res.status(500).json({message: err.message});
    }

});

//Get one
router.get('/:id', getSubscriber ,   (req, res) => {         //getSubscriber,

        
         res.json(res.subscriber);
   
});

//Create one
router.post('/', async (req, res) => {
    
    const subscriber = new Subscriber({
       // _id: req.body.id,
        name: req.body.name,
        subscriberToChannel: req.body.subscriberToChannel
    });
    try{
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);

    } catch (err) {
        res.status(400).json({message: err.message});
            
    }


});

//Update one (put update all at once patch updates only one at a time)
router.patch('/:id', getSubscriber , async (req, res) => {
    if(req.body.name != null) {
        res.subscriber.name = req.body.name;
    }
    if(req.body.subscriberToChannel != null) {
        res.subscriber.subscriberToChannel = req.body.subscriberToChannel;
    }
    try {
        const updatedSubscriber = await res.subscriber.save();
        res.json(updatedSubscriber);

    } catch(err) {
        res.status(400).json({message: err.message});
    }

});

//Delete one
router.delete('/:id',getSubscriber , async (req, res) => {
    try{

        await res.subscriber.remove();
        res.json({message: 'Deleted successfully'});
    } catch(err){
        res.status(500).json({message: err.message});
    }

});

async function getSubscriber (req, res, next ){ // getsubscriber works as a middle wear
    let subscriber;
    try{
        subscriber = await Subscriber.findById(req.params.id);
        if (subscriber == null) {
            return res.status(404).json({message: 'Cannot find Subscriber'});
        }

    } catch(err) {
        res.status(500).json({message: err.message});
    }
    res.subscriber = subscriber;
   // res.json(subscriber.name);
    next();

}

module.exports = router;