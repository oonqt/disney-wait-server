const app = require("express")();
const Themeparks = require("themeparks");
const cors = require("cors");
const { rideModel } = require("./models");
const { PORT } = require("./config.json");

const CA_API = new Themeparks.Parks.DisneylandResortCaliforniaAdventure();
const DL_API = new Themeparks.Parks.DisneylandResortMagicKingdom({ resortId: 80008297, parkId: 330339 });

app.use(cors({ methods: ["GET"] }));

app.get("/rideTimes", async (_, res) => {
    try {
        let waitTimesDL = await DL_API.GetWaitTimes();
        waitTimesDL = waitTimesDL.map(ride => {
            return rideModel(ride);
        });

        let waitTimesCA = await CA_API.GetWaitTimes();
        waitTimesCA = waitTimesCA.map(ride => {
            return rideModel(ride);
        });

        const times = [...waitTimesDL, ...waitTimesCA].sort((a, b) => { 
            const aCompare = a.name.replace(/"/g, "");
            const bCompare = b.name.replace(/"/g, "");

            return aCompare.localeCompare(bCompare.name);
        });

        res.json(times);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log("Listening on:", PORT));