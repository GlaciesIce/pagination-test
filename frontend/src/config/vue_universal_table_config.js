const config = {

    //TABLE OF CONTENTS
    /*
        Sorted By Variable Name :
        {{Line Number}}  ---  {{Variable}}

        
    */



    //api_url as a default value (No default value)
    /*
        Value must be a url string type, example :
            - '/api/dashboard-table'
            - 'https://www.testtable.com/dummy'
    */
   api_url : '',



    //data as a default value (No default value)
    /*
        If both 'api_url' and 'data' props is given at the same
            instance, 'api_url' will always be prioritized and
            'data' is ignored.

        Value must be an array of JSON Object data, example :
            [
                {
                    'id' : 22,
                    'name' : 'Andre',
                    'age' : 21
                },{
                    'id' : 23,
                    'name' : 'Erik',
                    'age' : 23
                },{
                    'id' : 24,
                    'name' : 'Marvin',
                    'age' : 22
                },{
                    'id' : 25,
                    'name' : 'Thomas',
                    'age' : 23
                }
            ]
    */
    data : ``,



    //PATH TO 'data' in API (default : 'data')
    /*
        In JSON Object type, examples:
        - 'result.data'
        - 'response.data_is_here'
        - 'other_variables'
    */
    path_to_data : 'result.data',



    //PATH TO 'meta' in API (default : 'meta') [Example : 'result.meta']
    /*
        In JSON Object type, examples:
        - 'result.meta'
        - 'response.meta_is_here'
        - 'other_variables'
    */
    path_to_meta : '',



    //Date Format with moment.js support
    /*
        Moment.js Format Documentation :
            https://momentjs.com/docs/#/parsing/string-format/
    */
    date_format : '',



    //Disable sort as a default value (default : true)
    disable_sort : true,



    //Sort by as a default value (No default value)
    /*
        WARNING! Setting a default value for 'sort_by' can be very dangerous,
            as the exact value of the variable set in 'sort_by' must always
            be sent, otherwise an error will occur.

        Value must be a string type, example:
        - 'created_at'
        - 'id'
    */
    sort_by : '',



    //Sort order as a default value (default : 'ASC')
    /*
        Values can only be:
        - 'ASC' for Ascending
        - 'DESC' for Descending
    */
    sort_order : 'ASC',



    //Disable limit per page as a default value (default : false)
    disable_limit_per_page : false,



    //Limit per page as a default value (default : 15)
    /*
        Values must be an integer, example:
        - 15
        - 30
        - 50
    */
    limit_per_page : 15,



    //Limit per page options as a default value (default : [15, 30, 50])
    /*
        Values must be an array of integer, example:
        - [20, 40, 60]
        - [10, 30, 50]
        - [25, 50, 100, 150]
    */
    limit_per_page_options : [15, 30, 50],



    //Indexing as a default value (default : false)
    /*
        Indexing will create a numbering system for the table,
            starting for 1 and will increase accordingly.

        Value must be a boolean type
    */
    indexing : false,



    //process_data as a default value (No default value)
    /*
        WARNING! Setting a default value for 'process_data' will process
            every api call throughout every instance unless stated not to
            by sending an empty string 'process_data' props.

        Data accepted from api will be stored in variabled called 'data'.
            The executable string must return and store the value back to
            the 'data' variable to be successfully processed.

        Value must be an executable string type, example :
            - 'data = data.map((x)=>{return{id:x.id, name:x.name, celcius:(x.fahrenheit-32)*5/9}})'
            - 'for(var i in data) data[i].name = data[i].user.fullname'
            - 'console.log(JSON.stringify(data))'
    */
    process_data : false,



    //Infinite Scroll as a default value (default : false)
    infinite_scroll : false,



    //Pagination as a default value (default : true)
    /*
        WARNING! Setting a default 'false' value for 'pagination' will
            disable all pagination unless stated specifically for each
            instance of the vue_universal_table usage

        Value must be a boolean type
    */
    pagination : true,



    //dummy_table as a default value (default : false)
    /*
        WARNING! Setting a default 'true' value for 'dummy_table' will
            create a dummy pagination that is not responsive to all instance
            of table usage, unless specifically stated not to

        Value must be a boolean type
    */
    dummy_table : false,



    //fixed_header as a default value (default : false)
    /*
        fixed_header will turn the header into a fixed position state, on
            the top of the table. 'tbody_height' will directly determine
            the body height of the table.

        Value must be a boolean type
    */
   fixed_header : false,



   //tbody_height as a default value (default : '500px')
   /*
        tbody_height is the default value for the fixed body height of the
            table. It only accepts 'em', 'px', and '%' as a unit of measurement

       Value must be a string type.
   */
  tbody_height : '500px',

};

export default {config};