const app = require("express")();
const Themeparks = require("themeparks");
const { rideModel } = require("./models");
const { PORT } = require("./config.json");

const DL_API = new Themeparks.Parks.DisneylandResortCaliforniaAdventure({ parkId: 330339 });
const CA_API = new Themeparks.Parks.DisneylandResortCaliforniaAdventure({ forceCreate: true });

app.get("/rideTimes", async (req, res) => {
    try {
        let waitTimesDL = await DL_API.GetWaitTimes();
        waitTimesDL = waitTimesDL.map(ride => {
            return rideModel(ride);
        });

        let waitTimesCA = await CA_API.GetWaitTimes();
        waitTimesCA = waitTimesCA.map(ride => {
            return rideModel(ride);
        })

        res.json([...waitTimesDL, ...waitTimesCA]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log("Listening on:", PORT));