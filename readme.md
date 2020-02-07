# Date tools for mongodb
## dateUpdate.js
Used to update the date in the specified property of the class, e.g. to change the time zone formats.   
  
Usage:
```js
collectionName = 'khv-ticket-discount_ticket' //specify a mongodb collection name
dateField = 'dateAirGo' //property of the class that will be changed
downFrom = new Date(2020,0,1) //filter changing objects by a time interval 
upTo = new Date(2020,5,5)
matchHours = 14 //specify the hour value of dates that will be changed
changeHoursBy = 10 //increment(decrement) value of hours

// here all objects of the class "khv-ticket-discount_ticket" with values of the property "dateAirGo" that fall in
// the span of january 1st, 2020 through june 5th, 2020, with the hour part of 14 (2pm) will be changed with
// their dates in "dateAirGo" incremented by 10 hours

agrDateField = '$' + dateField

db.getCollection(collectionName).update(
    { $and: [
    { [dateField]: {$lte: upTo} },
    { [dateField]: {$gte: downFrom} }
        ]
},
    [
    { $set: { [dateField]: { $switch: {
                           branches: [
                               { case: { $eq: [ {$hour: agrDateField}, matchHours ] }, then: {$toDate: {$sum: [{$toLong: agrDateField},1000*60*60*changeHoursBy] } } },
                               { case: { $ne: [ {$hour: agrDateField}, matchHours ] }, then: agrDateField },
                           ],
                           default: agrDateField
     } } }}
    ],
    { multi: true }
)
```

## getUTCdates.js
Used to fetch the objects with the hour part of the date property equal to the specified value. Secondly it fetches every object
that didn't pass that filter.  
  
Usage:
```js
collectionName = 'khv-ticket-discount_ticket' //the collection of objects to fetch from
dateField = 'dateAirGo' //the property to check
matchHours = 0 //specify the hour part to be matched against the value in the date

// In the first pass it gets all objects of the class 'khv-ticket-discount_ticket' with the hour part of
// 'dateAirGo' property equal to 0 (12pm)
// the second pass fetches every other object

agrDateField = '$' + 'dateAirGo'

db.getCollection(collectionName).aggregate([
    {
        $project: {
            hours: {$hour: agrDateField},
            [dateField]: 1
        }
    },
    {
        $match: {
            hours: matchHours
        }
    }
])
db.getCollection(collectionName).aggregate([
   {
     $project: {
         hours: {$hour: agrDateField},
         [dateField]: 1
    }
 },
 {
     $match: {
         hours: {$ne: matchHours}
     }
 }
])
```