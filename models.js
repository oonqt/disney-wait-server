exports.rideModel = (ride) => ({
  name: ride.name,
  status: ride.status,
  location: ride.meta.area,
  waitTime: ride.waitTime,
  fastPass: ride.fastPass,
});

exports.openingTimeModel = (data, name) => {
    let modeled = { name };

    if (data.type !== 'Closed') {
        modeled.opening = new Date(data.openingTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' });
        modeled.closing = new Date(data.closingTime).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' });
        modeled.closed = false;
    } else {
        modeled.closed = true;
    }

    return modeled;
};