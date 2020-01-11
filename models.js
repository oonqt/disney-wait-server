module.exports.rideModel = (ride) => {
    return {
        name: ride.name,
        status: ride.status,
        location: ride.meta.area,
        waitTime: ride.waitTime,
        fastPast: ride.fastPass
    }
}