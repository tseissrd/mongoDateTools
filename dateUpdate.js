downFrom = new Date(2020,0,1)
upTo = new Date(2020,5,5)
matchHours = 14
hours = 10

db.getCollection('khv-ticket-discount_ticket').update(
    { $and: [
    { dateAirGo: {$lte: upTo} },
    { dateAirGo: {$gte: downFrom} }
        ]
},
    [
    { $set: { 'dateAirGo': { $switch: {
                           branches: [
                               { case: { $eq: [ {$hour: '$dateAirGo'}, matchHours ] }, then: {$toDate: {$sum: [{$toLong: '$dateAirGo'},1000*60*60*hours] } } },
                               { case: { $ne: [ {$hour: '$dateAirGo'}, matchHours ] }, then: '$dateAirGo' },
                           ],
                           default: '$dateAirGo'
     } } }}
    //{ $set: { 'dateAirGo': {$toDate: {$sum: [{$toLong: '$dateAirGo'},1000*60*60*hours] } } }}
    ],
    { multi: true }
)