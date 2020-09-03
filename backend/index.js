'use strict';

require('module-alias/register');

const express       = require('express');

const bodyParser    = require('body-parser');

const app           = express();
const data          = require('./sampleData.json');
const router        = express.Router();

app.use(
    bodyParser.urlencoded({
        extended: false,
        limit: "50mb",
    })
);

app.use(bodyParser.json());
router.get('/',function(req,res,next){
    try{
        let by = (req.query.by)? req.query.by : 'name';
        let order = (req.query.order) ? req.query.order : 'DESC';
        let limit = 15;
        let offset = 0;
        let page = 1;

        if(req.query.limit){
            limit = parseInt(req.query.limit);
        }
        if(req.query.page){
            page = parseInt(req.query.page);
            offset = (page-1) * limit;
        }

        let sortedData = data.sort(compare([by,order]));
        sortedData = sortedData.slice(offset,limit);
        let result = {
            code:200,
            message:"Success",
            data:sortedData,
            meta:{
                currentPage:page
            }
        }
        res.status(200).json(result);
    }
    catch(e){
        console.error(e)
        let result = {
            code:500,
            message:"Fatal Error",
            data:e
        }
        res.status(500).json(result);
    }
});
app.use(router)
app.listen(5000,() => console.log(`app running at port: 5000`));

function compare(properties){
    let property = properties[0];
    let order = properties[1].toUpperCase();
    var sortOrder = 1;
    if(order == 'DESC'){
        sortOrder = -1;
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder ;
    }
}