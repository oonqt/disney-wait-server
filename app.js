const app = require("express")();
const compression = require('compression');
const Themeparks = require("themeparks");
const cors = require("cors");
const { rideModel, openingTimeModel } = require("./models");
const { PORT } = require("./config.json");

const CA_API = new Themeparks.Parks.DisneylandResortCaliforniaAdventure();
const DL_API = new Themeparks.Parks.DisneylandResortMagicKingdom({
  resortId: 80008297,
  parkId: 330339,
});

app.use(cors({ origin: "*", methods: ["GET"] }));
app.use(compression());

app.get('/parks', async (req, res) => {
  try {
    const dlOpeningTime = (await DL_API.GetOpeningTimes())[0];
    const caOpeningTime = (await CA_API.GetOpeningTimes())[0];
    
    res.json([openingTimeModel(dlOpeningTime, 'Disneyland'), openingTimeModel(caOpeningTime, 'California Adventure')]);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/rideTimes", async (req, res) => {
  try {
    const park = req.query.park;
    if (!park || typeof park !== 'string') return res.status(400).json({ msg: 'Invalid or missing park type' });

    let waitTimes;

    switch (park.toLowerCase()) {
      case "disneyland":
        waitTimes = await DL_API.GetWaitTimes();
        break;
      case "california adventure":
        waitTimes = await CA_API.GetWaitTimes();
        break;
      default:
        return res.status(400).json({ msg: "Invalid park type" });
    }

    // Retrieve only the properties needed to minimize bandwidth
    waitTimes = waitTimes.map(ride => rideModel(ride));

    // Sort alphabetically
    waitTimes = waitTimes.sort((a, b) => {
      const aCompare = a.name.replace(/"/g, "");
      const bCompare = b.name.replace(/"/g, "");

      return aCompare.localeCompare(bCompare);
    });

    res.json(waitTimes);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log("Listening on:", PORT));
