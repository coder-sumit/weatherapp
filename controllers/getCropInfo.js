const db = require("../config/firebase");
const { get } = require("../routes");

let cropRef = db.collection("crops");
let weatherAnalysisRef = db.collection("weatherAnalysis");

function getSeason(month) {
    if (month >= 3 && month <= 6) {
        return "summer";
    } else if (month >= 7 && month <= 10) {
        return "winter";
    } else {
        return "rainy";
    }
}

const getCropInfo = async (req, res) => {
    try {
        let month = (new Date()).getMonth() + 1;
        let season = getSeason(month);
        let locations = req.body.cities;
        // convert all locations to capatelize
        locations = locations.map((city) => {
            let first = city.slice(0, 1);
            first = first.toUpperCase();
            city = city.slice(1);
            city = city.toLowerCase();
            city = first + city;
            return city;
        });


        let crops = await Promise.all(
            locations.map(async (location) => {
                // get data from analysis to calculate avg temp
                let weatherAnalysis = await weatherAnalysisRef.where("location", "==", location).where("month", "==", month).get();
                weatherAnalysis = weatherAnalysis.docs.map((doc) => doc.data());
                let weatherMin = weatherAnalysis.map((doc) => doc.temp_min);
                let weatherMax = weatherAnalysis.map((doc) => doc.temp_max);

                let avgArr = weatherMax.concat(weatherMin);
                let avgCount = avgArr.length;
                let avgSum = 0;
                avgArr.forEach(val => {
                    avgSum += val;
                });
                let avgTemp = avgSum / avgCount;

                // get best crop for these conditions
                let crop = await cropRef.where("season", "==", season).get();
                crop = crop.docs.map((doc) => doc.data());
                crop = crop.filter((doc) => {
                    let min = doc.temp_min;
                    let max = doc.temp_max;
                    if (avgTemp >= min && avgTemp <= max) {
                        return 1;
                    }
                });
                // add message to crops
                crop = crop.map((doc) => {
                    doc.message = `Avg Temp is ${avgTemp} for this temp best ${doc.type} is ${doc.name}`;
                    return doc;
                });


                return crop;
            })
        );

        return res.status(200).json({
            res: {
                status: "success",
                code: 200
            },
            message: "Data Fetched!",
            data: crops
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            res: {
                status: "failed",
                code: 500
            },
            message: "Internal Server Error!"
        })
    }


}

module.exports = getCropInfo;