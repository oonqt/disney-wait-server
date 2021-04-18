exports.rideModel = (ride) => ({
    name: ride.name,
    id: ride.id,
    status: ride.status,
    waitTime: ride.waitTime,
    fastPass: ride.fastPass,
    lastUpdate: ride.lastUpdate,
    singleRider: ride.meta.singleRider,
    pregnancyUnsuitable: ride.meta.unsuitableForPregnantPeople || false,
  });
  
  exports.openingTimeModel = (data, name) => {
    let modeled = { name };
  
    if (data.type !== "Closed") {
      modeled.opening = new Date(data.openingTime).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      modeled.closing = new Date(data.closingTime).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      modeled.closed = false;
    } else {
      modeled.closed = true;
    }
  
    return modeled;
  };
  