const fs = require('fs');

// Read the content of the heartrate.json file
const rawData = fs.readFileSync('heartrate.json');
const measurements = JSON.parse(rawData);

// Group measurements by day
const groupedMeasurements = {};
measurements.forEach(measurement => {
    const date = measurement.timestamps;
    if (!groupedMeasurements[date]) {
        groupedMeasurements[date] = [];
    }
    groupedMeasurements[date].push(measurement);
});

// Calculate statistics for each day and prepare the output
    const output = Object.keys(groupedMeasurements).map(date => {
    const measurements = groupedMeasurements[date].map(measurement => measurement.beatsPerMinute);
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const median = calculateMedian(measurements);
    const latestDataTimestamp = groupedMeasurements[date][groupedMeasurements[date].length - 1].timestamp;

    return {
        date,
        min,
        max,
        median,
        latestDataTimestamp
    };
});

// Write the output to output.json file
fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Output has been written to output.json');

// Function to calculate median
function calculateMedian(arr) {
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const middle = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 === 0) {
        return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
    } else {
        return sortedArr[middle];
    }
}
