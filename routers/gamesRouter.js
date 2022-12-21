//notes router
const express = require("express");

const router = express.Router();

const Game = require("../models/gamesModel");
const send = require("send");


//create route
router.get("/", async (req, res) => {
    console.log("GET collection");
    if (req.header('Accept') !== "application/json") {
        res.status(415).send();
    }
    try {

        let games = await Game.find();

        // create representation for collection as requested assignment
        //items , _links , pagination
        let gamesCollection = {
            items: games,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}games/`
                },
                collections: {
                    href: `${process.env.BASE_URI}games/`
                }
            },
            pagination: "Update van de games "
        }
        res.json(gamesCollection);
    } catch {
        res.status(500).send();
    }
});


//create route for detail get
router.get("/:id", async (req, res) => {
    console.log("GET");
    try {
        let game = await Game.findById(req.params._id)
        if (game == null) {
            res.status(404).send();
        } else {
            res.json(game)
        }
    } catch {
        res.status(415).send();
    }
});

// middelware check headers for post
router.post("/", (req, res, next) => {
    console.log(req.header("Content-Type"));

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(400).send();
    } else {
        next();
    }
});


// middleware to disallow empty values post
router.post("/", (req, res, next) => {
    console.log("POST middleware for empty values");

    if (req.body.title && req.body.console && req.body.genre) {
        next();
    } else {
        res.status(400).send();
    }
});

//create route
router.post("/", async (req, res) => {
    console.log("POST request collection");

    //deze info moet uit een request komen
    let game = new Game({
        title: req.body.title,
        console: req.body.console,
        genre: req.body.genre
    })
    try {
        await game.save();
        res.status(201).send(game);
    } catch {
        res.status(500).send();
    }


});

//middleware check headers for put
router.put("/:id", async (req, res, next) => {
    console.log("Middleware to check content type for post")
    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(400).send();
    } else {
        next();
    }
})
//middleware to disallow empty values put
router.put("/:id", async (req, res, next) => {
    console.log("PUT Middleware to check for empty values for post")
    if (req.body.title && req.body.console && req.body.genre) {
        next();
    } else {
        res.status(400).send();
    }
})

router.put("/:id", async (req, res) => {

    let game = await Game.findOneAndUpdate(req.params,
        {
            title: req.body.title,
            console: req.body.console,
            genre: req.body.genre
        })
    try {
        game.save();
        res.status(203).send();
    } catch {
        res.status(500).send();
    }
})

//create route for delete
router.delete("/:id", async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params._id);

        res.status(204).send();

    } catch {
        res.status(404).send();
    }
})

//create route
router.options("/", (req, res) => {
    console.log("OPTIONS");
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.send();
});

router.options("/:id", async (req, res) => {
    console.log("OPTIONS");
    res.set(
        {
            'Allow': 'GET,PUT,DELETE,OPTIONS'
        }
    )
    send();
});

module.exports = router;

