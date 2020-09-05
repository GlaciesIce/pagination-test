'use strict';

require('module-alias/register');

const express       = require('express');

const bodyParser    = require('body-parser');

const app           = express();
const cors          = require('cors');
const data          = require('./sampleData.json');
const router        = express.Router();


// Initialise App with Extensions
app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: false,
        limit: "50mb",
    })
);

app.use(bodyParser.json());
router.get('/',function(req,res){
    try{
        let by = (req.query.by)? req.query.by : 'name';
        let order = (req.query.order) ? req.query.order : 'DESC';
        let pagination = (req.query.pagination) ? req.query.pagination: 'false';
        let limit = 15;
        let offset = 0;
        let page = 1;
        let search = req.query.search;

        let sortedData = data.sort(compare([by,order]));

        if(search){
            var query = [];
           data.forEach(function (e){
               if(e.name.includes(search) || e.phone.includes(search) || e.email.includes(search) || e.age == search || e.address.includes(search) || e.id == search || e.created_at.includes(search)){
                   query.push(e);
               }
           });
           sortedData = query.sort(compare([by,order]))
        }

        
        let result = {};
        if(pagination == 'true'){
            if(req.query.limit){
                limit = parseInt(req.query.limit);
            }
            if(req.query.page){
                page = parseInt(req.query.page);
                offset = (page-1) * limit;
            }
            let lastPage = Math.ceil(data.length / limit);
            
            sortedData = sortedData.slice(offset,limit + offset);
            result = {
                code:200,
                message:"Success",
                data:sortedData,
                meta:{
                    currentPage:page,
                    lastPage:lastPage
                }
            }
            return res.status(200).json(result);
        }
        result = {
            code:200,
            message:'Success',
            data:sortedData,
            meta:{
                currentPage:page
            }
        }
        return res.status(200).json(result);
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
app.listen(5000,() => console.log(`App running at port: 5000`));

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