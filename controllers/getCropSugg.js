const db = require("../config/firebase");

function getSeason(month) {
    if (month >= 3 && month <= 6) {
        return "summer";
    } else if (month >= 7 && month <= 10) {
        return "winter";
    } else {
        return "rainy";
    }
}


let cropRef = db.collection("crops");
let weatherAnalysisRef = db.collection("weatherAnalysis");

const getCropSuggestion = async (req, res) => {
 try{
    let city = req.query.city;
    // convert city to capatlize text
    let first = city.slice(0, 1);
    first = first.toUpperCase();
    city = city.slice(1);
    city = city.toLowerCase();
    city = first + city;
    let date = new Date();
    let month = date.getMonth() + 1;
    let season = getSeason(month);

    // get data from analysis to calculate avg temp
    let weatherAnalysis = await weatherAnalysisRef.where("location", "==", city).where("month", "==", month).get();
    weatherAnalysis = weatherAnalysis.docs.map((doc) => doc.data());
    let weatherMin = weatherAnalysis.map((doc) => doc.temp_min);
    let weatherMax = weatherAnalysis.map((doc) => doc.temp_max);
    
    let avgArr = weatherMax.concat(weatherMin);
    let avgCount = avgArr.length;
    let avgSum =0;
    avgArr.forEach(val => {
        avgSum += val;
    });
    let avgTemp = avgSum/avgCount;

    // get best crop for these conditions
    let crops = await cropRef.where("season", "==", season).get();
    crops = crops.docs.map((doc)=> doc.data());
    crops = crops.filter((doc)=>{
        let min = doc.temp_min;
        let max = doc.temp_max;
        if(avgTemp >= min && avgTemp <= max){
            return 1;
        }
    });
   
    // give the response
    if(crops.length <1){
        return res.status(200).json({
            res: {
                status: "success",
                code: 200
            },
            message: "No Suggestion for Now!",
            data: {},
        })
    }
    crops = crops[0];

    return res.status(200).json({
        res: {
            status: "success",
            code: 200
        },
        message: `Avg Temp is ${avgTemp} for this temp best ${crops.type} is ${crops.name}`,
        data: crops
    });

 }catch(err){
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
module.exports = getCropSuggestion;