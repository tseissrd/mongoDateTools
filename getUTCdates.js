matchHours = 14

db.getCollection('khv-ticket-discount_ticket').aggregate([
    {
        $project: {
            hours: {$hour: '$dateAirGo'},
            dateAirGo: 1
        }
    },
    {
        $match: {
            hours: matchHours
        }
    }
])
    db.getCollection('khv-ticket-discount_ticket').aggregate([
    {
        $project: {
            hours: {$hour: '$dateAirGo'},
            dateAirGo: 1
        }
    },
    {
        $match: {
            hours: {$ne: matchHours}
        }
    }
])