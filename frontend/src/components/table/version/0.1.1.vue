<!--
  ===================
    Version : 0.1.1
  ===================

  Version Changed : 2020-10-17
  
  Last Update Changes : 
  * Added 'date_format' for moment js format support in 'fields' prop
  * Added 'export_config' for auto exporting data when the word 'export' is used,
    it also auto determines which file to export based on the button title as well.
    export_config has 3 main components :
    > 'name' - name of the file
    > 'type' - type of the file (ex. csv, xlsx)
    > 'all' - retrieve all data before exporting, by setting pagination=false
-->
<template>
    <div>
      <div class="row" v-if="!propsValid.valid || config.currentlyFetching">
        <div class="col" v-if="!propsValid.valid" style="padding:20px; text-align: center; color: crimson;">
          {{propsValid.reason}}
        </div>
        <div class="col text-center mt-3 mb-3" v-if="config.currentlyFetching && (!config.fixedHeader || tableData.length == 0)">
          <fold :loading="true"></fold>
        </div>
      </div>
      <div>
  
        <div class="row mb-3" v-if="specialButtons.length > 0 || (!config.disablePerPage && !config.infiniteScrollEnabled)">
          <div class="col"
            :class="{
              'specialButtons' : !mobile && !config.disablePerPage && !config.infiniteScrollEnabled,
              'text-right' : !(!config.disablePerPage && !config.infiniteScrollEnabled)}">
            <div v-if="!mobile && !config.disablePerPage && !config.infiniteScrollEnabled">
              Per Page:&nbsp;
              <select class="selectPerPage" style="border-top: 0; border-left: 0; border-right: 0" v-model="config.limitPerPage">
                <option v-for="(num, index) in config.limitPerPageOptions">{{num}}</option>
              </select> 
            </div>
            <div v-if="specialButtons.length > 0">
              <button
                v-for="button in specialButtons"
                type="button"
                class="btn btn-primary"
                :class="{'w-100 mb-2' : mobile, 'ml-2' : !mobile}"
                @click="emit(button.variable)">{{ button.title }}</button>
            </div>
          </div>
        </div>
  
        <!-- TABLE CONTENT STARTS -->
        <!-- <div class="innerBox"> -->
        <div style="overflow-x: auto; overflow-y: hidden">
          <table class="table table-striped" :class="{'fixedHeader' : config.fixedHeader}" style="margin: 0">
            <!-- HEADER START -->
            <thead>
              <tr>
                <th class="tableTitle" v-if="config.indexing">No</th>
                <th v-for="title in tableHeaders.displayed"
                  class="tableTitle"
                  :class="{'sortable' : !title.disableSort}"
                  @click="selectAndSort(title.variable, title.disableSort)"
                >{{title.title}}</th>
                <th v-if="customButtons.title.length > 0" :colspan="customButtons.title.length" style="text-align: center;"><i class="fas fa-cog"></i></th>
              </tr>
            </thead>
            <!-- HEADER END -->
  
            <!-- CONTENT START -->
            <tbody :style="(config.fixedHeader) ? 'max-height:'+config.tbodyHeight : ''">
              <tr v-for="(singleRow, numbering) in tableData">
                <!-- Numbering/Indexing -->
                <td v-if="config.indexing" class="tableContent">{{ (config.currentPage-1)*config.limitPerPage + numbering+1 }}</td>
  
                <!-- All Data -->
                <td v-for="tableHeader in tableHeaders.displayed"
                  class="tableContent"
                  :style="style(tableHeader.style_condition, singleRow[tableHeader.variable])"
                >
                  <!-- CONTENT START -->
                  <span v-if="tableHeader.numberWithCommas">
                    {{numberWithCommas(singleRow[tableHeader.variable])}}
                  </span>
                  <span v-else-if="tableHeader.dateFormat">
                    {{moment(singleRow[tableHeader.variable]).format(tableHeader.dateFormat)}}
                  </span>
                  <span v-else>
                    {{singleRow[tableHeader.variable]}}
                  </span>
                  <!-- {{tableHeader.numberWithCommas ? numberWithCommas(singleRow[tableHeader.variable]) : moment(singleRow[tableHeader.variable], 'YYYY-MM-DDTHH:mm:ss.000Z', true).isValid() ? moment(singleRow[tableHeader.variable]).format('YYYY-MM-DD HH:mm:ss') : singleRow[tableHeader.variable]}} -->
                  <!-- CONTENT END -->
                </td>
                
                <!-- Buttons Start -->
                <td v-for="(button, index) in customButtons.title" style="text-align: center;">
                  <!-- No Icon Button -->
                  <button
                    v-if="customButtons.FAClass[index] == 0"
  
                    :title="toCapitalizedWords(button)"
                    type="button"
                    class="btn"
                    :class="(customButtons.class[index] != 0) ? customButtons.class[index] : 'btn-primary'"
                    :style="(customButtons.style[index] != 0) ? customButtons.style[index] : ''"
                    @click="emit(button, (customButtons.variable[index] != null && customButtons.variable[index] != '') ? singleRow[customButtons.variable[index]] : singleRow)"
                  >{{ toCapitalizedWords(button) }}</button>
  
                  <!-- Fontawesome Button -->
                  <button
                    v-else
  
                    :title="toCapitalizedWords(button)"
                    class="btn"
                    :class="(customButtons.class[index] != 0) ? customButtons.class[index] : 'btn-primary'"
                    :style="(customButtons.style[index] != 0) ? customButtons.style[index] : ''"
                    @click="emit(button, (customButtons.variable[index] != null && customButtons.variable[index] != '') ? singleRow[customButtons.variable[index]] : singleRow)"
                    ><i :class="(customButtons.FAClass[index] != 0) ? customButtons.FAClass[index] : ''"></i>
                  </button>
                </td>
                <!-- Buttons End -->
              </tr>
              <tr v-if="config.infiniteScrollEnabled && (config.currentPage < config.maxPage || config.maxPage == -1)">
                <td colspan="100%" v-observe-visibility="loadingSeen">
                  <h4 class="mt-2" style="text-align: center; width: 100%; margin: 0">
                    Loading...
                  </h4>
                </td>
              </tr>
            </tbody>
            <!-- CONTENT END -->
          </table>
        </div>
        <!-- TABLE CONTENT ENDS -->
        <!-- PAGINATION STARTS -->
        <div class="row" v-if="config.paginationExist && !config.infiniteScrollEnabled">
          <div v-if="!mobile" class="col-4">
            <p class="mt-2" style="color:#a3a4a6">
              Showing
                {{(config.currentPage-1) * config.limitPerPage + 1}}
              to
                {{((config.currentPage * config.limitPerPage) < config.total) ? config.currentPage * config.limitPerPage : config.total }}
              of
                {{ config.total }}
              entries
            </p>
          </div>
          <div style="padding: 20px" :class="(mobile) ? 'col' : 'col-4'">
            <nav>
              <ul class="pagination" style="justify-content:center">
                <li class="page-item" :class="{'disabled' : (config.currentPage <= 1)}" @click="changePage(1)">
                  <span class="page-link">&laquo;</span>
                </li>
                <li class="page-item" :class="{'disabled' : (config.currentPage <= 1)}" @click="changePage(5)">
                  <span class="page-link">&lsaquo;</span>
                </li>
                <li class="page-item pageNumber" style="cursor:pointer">
                  <span class="page-link" style="color:black">
                    <span style="font-weight: bold !important">{{(config.maxPage < 1) ? 0 : config.currentPage}}</span> of {{config.maxPage}}
                  </span>
                </li>
                <li class="page-item" :class="{'disabled' : (config.currentPage >= config.maxPage)}" @click="changePage(6)">
                  <span class="page-link">&rsaquo;</span>
                </li>
                <li class="page-item" :class="{'disabled' : (config.currentPage >= config.maxPage)}" @click="changePage(10)">
                  <span class="page-link">&raquo;</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <!-- PAGINATION ENDS -->
        <!-- DUMMY PAGINATION STARTS -->
        <div class="row" v-if="!config.paginationExist && config.showDummy">
          <div v-if="!mobile" class="col-4">
            <p class="mt-2" style="color:#a3a4a6">
              Showing
                1
              to
                {{ tableData.length }}
              of
                {{ tableData.length }}
              entries
            </p>
          </div>
          <div style="padding: 20px" :class="(mobile) ? 'col' : 'col-4'">
            <nav>
              <ul class="pagination" style="justify-content:center">
                <li class="page-item disabled">
                  <span class="page-link">&laquo;</span>
                </li>
                <li class="page-item disabled">
                  <span class="page-link">&lsaquo;</span>
                </li>
                <li class="page-item pageNumber" style="cursor:pointer">
                  <span class="page-link" style="color:black">
                    <span style="font-weight: bold !important">1</span> of 999
                  </span>
                </li>
                <li class="page-item">
                  <span class="page-link">&rsaquo;</span>
                </li>
                <li class="page-item">
                  <span class="page-link">&raquo;</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <!-- DUMMY PAGINATION ENDS -->
  
      </div>
    </div>
  </template>
  
  <script>
    import { ObserveVisibility } from "vue-observe-visibility";
    import moment from 'moment';
    import XLSX from 'xlsx';
    import { FoldSpinner } from 'vue-spinners'
    import 'vue-spinners/dist/vue-spinners.css'
  
    export default {
      data () {
        return {
          moment,
          mobile : this.isMobile(),
          tableData : [],
          tableHeadersFetched : false,
          customButtons : {
            title : [],
            variable : [],
            class : [],
            style : [],
            FAClass : [],
          },
          specialButtons : [],
          config : {
            fieldPropsExist : false,//IS 'field' GIVEN IN PROPS
            paginationExist : true,//IS 'pagination' APPLIED
            infiniteScrollEnabled : false,//IS 'infinite_scroll' activated
            substituteData : false,//IS 'api_url' being substituted with 'data'
            disablePerPage : false,//Disables and removes limit per page options on the top left
            showDummy : false,//Shows dummy pagination
            indexing : false,//Show number or index
            fixedHeader : false,//Fixed position header
            tbodyHeight : '500px',//tbody height
  
            processData : null,//Process data after api is called through an executable string
  
            limitPerPageOptions : [15, 30, 50],
            currentlyFetching : false,
  
            exportFile : {
              name : 'Data Download',
              type : 'xlsx',
              all : false
            },
  
            //PAGINATION CONFIGS
            currentPage : 1,
            maxPage : 1,
            total : 0,
            limitPerPage : 15,//LIMIT PER PAGE
            by : null,
            order : false,//true = ascending, false = descending
          },
          tableHeaders : {
            displayed : [],
            originalTitles : []
          },
          filterUrl : '',
          propsValid : {
            valid : true,
            reason : ''
          },
          exportData : [],
        }
      },
      props : [
        'data',//DATA IN OBJECT FORM - Array of JSON Object (ex.[{ 'name' : 'Andre', 'phone' : '12345' },{ 'name' : 'Bob', 'phone' : '23145' }])
        'api_url',//[REQUIRED IF NO DATA] URL OF API TO CALL - String (ex. '/api/callme')
        'update',//CALL API & UPDATE TABLE - Integer (ex. 1,2,3,...)
        'filter',//FILTER - JSON Object (ex. { 'name' : 'Andre', 'phone' : '12345' })
        'buttons',//WHAT KIND OF BUTTONS ON THE END OF EACH ROW - Array of String or Array of Objects (ex. ['Edit', 'Delete'])
        'special_buttons',//BUTTONS PLACED ON THE TOP RIGHT OF THE TABLE - Array of String (ex. ['newUser', 'newBranch'])
        'sort_by',//DEFAULT SORT BY VARIABLE - String (ex. 'created_at')
        'fields',//FIELDS NAME AND VARIABLE INCLUDING ORDER OF FIELDS - Array of Objects (ex. [{'title' : 'Name', 'variable' : 'name'},{'title' : 'Created At', 'variable' : 'created_at'}])
        'disable_sort',//DISABLE SORT FOR ALL FIELDS - Boolean (ex. true, false)
        'limit_per_page',//LIMIT PER PAGE - Integer (ex. 15, 30, 50,...)
        'limit_per_page_options',//LIMIT PER PAGE OPTIONS - Array of Integers (ex. [15, 30, 50,...])
        'disable_limit_per_page',//DISABLE AND REMOVE PER PAGE OPTIONS - Boolean (ex. true, false)
        'sort_order',//DEFAULT SORT ORDER - String (ex. ASC, DESC)
        'pagination',//IS PAGINATION ENABLED; DEFAULT TRUE - Boolean (ex. true, false)
        'infinite_scroll',//IS THE TABLE AN INFINITE SCROLL TYPE; DEFAULT FALSE - Boolean (ex. true, false)
        'dummy_table',//REVEAL NON-FUNCTIONING PAGINATION - Boolean (ex. true, false)
        'indexing',//ADD INDEX OR NUMBERING SYSTEM ON THE TABLE; DEFAULT FALSE - Boolean (ex. true, false)
        'process_data',//PROCESS DATA AFTER API IS CALLED, EVAL() IS USED - String (ex. 'data = data.map((x) => return {id:x.id, name:x.customer.name})')
        'fixed_header',//FIXED TITLE HEADERS; DEFAULT false - Boolean (ex. true, false)
        'tbody_height',//MAX HEIGHT FOR TBODY; DEFAULT 500px - String (ex. 200px, 10em)
        'export_config',//EXPORT CONFIG; name(ex. 'Data'), type(ex. 'csv', 'xlsx'), all(true, false)
      ],
      components: {
        fold : FoldSpinner
      },
      directives: {
        ObserveVisibility
      },
      mounted () {
        this.checkPropsPreAPI();
      },
      watch : {
        'update' : function () {
          if(this.config.infiniteScrollEnabled) this.tableData.length = 0
          this.fetchData(1);
        },
        'config.limitPerPage' : function () {
          this.fetchData(1);
        },
      },
      methods : {
        newError(errorMessage){
          var error = "%c" + errorMessage;
          console.log(error, 'color:#ff0000')
        },
        numberWithCommas(x) {
          return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        toCapitalizedWords(name){
          var words = name.match(/[A-Za-z][a-z]*/g) || [];
          return words.map(this.capitalize).join(" ");
        },
        capitalize(s){
          if (typeof s !== 'string') return ''
          return s.charAt(0).toUpperCase() + s.slice(1)
        },
        //Check export button and emits other button
        emit(buttonTitle, variableValue){
          //If button title has the work 'export'
          if(buttonTitle.toLowerCase().match(/(export|EXPORT)/)){
            if(!(this.export_config && this.export_config.type)){
              if(buttonTitle.toLowerCase().match(/(xlsx|excel)/)) this.config.exportFile.type = 'xlsx'
              else if(buttonTitle.toLowerCase().match(/(csv)/)) this.config.exportFile.type = 'csv'
            }
            this.exportFile();
          } else {
            if(variableValue != null) eval(`this.$emit('on${this.capitalize(buttonTitle)}', '${JSON.stringify(variableValue)}')`);
            else eval(`this.$emit('on${this.capitalize(buttonTitle)}')`);
            // console.log(`this.$emit('on${this.capitalize(buttonTitle)}', '${variableValue}')`);
          }
        },
        isMobile(){
          return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
        },
        style(condition, value){
          if(typeof condition == 'object' && condition != null){
            for(var i = 0; i < condition.length; i++){
              if(condition[i].value == value){
                return condition[i].style
              }
            }
          }
          return ''
        },
        checkPropsPreAPI(){
          //CHECK api_url or data [REQUIRED EITHER api_url OR data]
          if(this.api_url == null || this.api_url == '' || this.api_url == 'NaN'){
            if(this.data == null){
              this.propsValid.valid = false
              this.propsValid.reason = "'api_url' is Empty!"
            } else {//'api_url' is being substituted with 'data'
              this.config.substituteData = true;
              this.config.disablePerPage = true;//auto true on disable per page when substituted
              this.config.paginationExist = false;//auto false on pagination when substituted
            }
          } else {
            if(this.data != null && this.data.length != 0){//if both api_url and data has been filled in
              this.propsValid.valid = false
              this.propsValid.reason = "Choose either 'api_url' or 'data' to be filled in, cannot be both!"
            }
          }
  
          //CHECK sort_by
          if(this.sort_by == null || this.sort_by == '' || this.sort_by == 'NaN'){
            
          } else {
            this.config.by = this.sort_by;
          }
  
          //CHECK limit_per_page_options
          if(this.limit_per_page_options != null){
            if(!Array.isArray(this.limit_per_page_options)){
              this.propsValid.valid = false
              this.propsValid.reason = 'limit_per_page_options must be an array!'
            } else {
              for(var i = 0; i < this.limit_per_page_options.length; i++){
                if(typeof this.limit_per_page_options[i] != 'number'){
                  this.propsValid.valid = false
                  this.propsValid.reason = 'limit_per_page_options must be an array of integers!'
                }
              }
              this.config.limitPerPageOptions.length = 0;
              this.config.limitPerPageOptions = this.limit_per_page_options;
              this.config.limitPerPage = this.limit_per_page_options[0];
            }
          }
  
          //CHECK limit_per_page
          if(this.limit_per_page != null){
            if(this.limit_per_page_options == null || this.config.limitPerPageOptions.find(opt=>opt==this.limit_per_page)){
              if(typeof this.limit_per_page != 'number'){
                this.propsValid.valid = false
                this.propsValid.reason = 'limit_per_page must be an integer!'
              } else 
                this.config.limitPerPage = this.limit_per_page
            } else {
              this.propsValid.valid = false
              this.propsValid.reason = 'limit_per_page cannot be found inside limit_per_page_options'
            }
          }
          
          //CHECK disable_limit_per_page
          if(this.disable_limit_per_page != null){
            if(typeof this.disable_limit_per_page == 'boolean'){
              this.config.disablePerPage = this.disable_limit_per_page;
            } else {
              this.propsValid.valid = false;
              this.propsValid.reason = "disable_limit_per_page must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK sort_order
          if(this.sort_order != null){
            if(this.sort_order.toLowerCase() === 'asc' || this.sort_order.toLowerCase() === 'desc'){
              (this.sort_order.toLowerCase() === 'asc') ? this.config.order = true : this.config.order = false
            } else {
              this.propsValid.valid = false
              this.propsValid.reason = "'sort_order' can only have a value of either 'ASC' or 'DESC'"
            }
          }
  
          //CHECK pagination
          if(this.pagination != null){
            if(typeof this.pagination == 'boolean'){
              this.config.paginationExist = this.pagination
            } else {
              this.propsValid.valid = false;
              this.propsValid.reason = "Pagination must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK buttons
          if(this.buttons != null){
            if(!Array.isArray(this.buttons)){
              this.propsValid.valid = false
              this.propsValid.reason = 'Buttons must be an array of string!'
            } else if (this.buttons.length < 1){
              this.propsValid.valid = false
              this.propsValid.reason = 'Buttons is an empty array'
            } else {
              if(typeof this.buttons[0] == 'string'){
                for(var i = 0; i < this.buttons.length; i++){
                  if(this.buttons[i] == null || this.buttons[i] == ''){
                    this.propsValid = false
                    this.propsValid.reason = 'Buttons cannot have an empty string'
                  }
                }
              } else {
                var customButtonTitle = new Array(this.buttons.length).fill(0);
                var customButtonVariable = new Array(this.buttons.length).fill(0);
                var customButtonClass = new Array(this.buttons.length).fill(0);
                var customButtonStyle = new Array(this.buttons.length).fill(0);
                var customButtonFAClass = new Array(this.buttons.length).fill(0);
                for(var i = 0; i < this.buttons.length; i++){
  
                  if(this.buttons[i].title == null){//TITLES [REQUIRED]
                    this.propsValid = false
                    this.propsValid.reason = 'Buttons have been implemented incorrectly'
                  } else {
                    customButtonTitle[i] = this.buttons[i].title;
                  }
  
                  if(this.buttons[i].variable == null || this.buttons[i].variable == ''){//VARIABLE [OPTIONAL]
                    // this.propsValid = false
                    // this.propsValid.reason = 'Buttons have been implemented incorrectly'
                  } else {
                    customButtonVariable[i] = this.buttons[i].variable;
                  }
  
                  if(this.buttons[i].class != null){//CLASS AND FONT AWESOME CLASS
                    var compiledClass = [[],[]]//[0]FAClass [1]Class
                    for(var j = 0; j < this.buttons[i].class.split(/[\s]+/).length; j++){
                      if(this.buttons[i].class.split(/[\s]+/)[j].includes("fa")){
                        compiledClass[0].push(this.buttons[i].class.split(/[\s]+/)[j])
                      } else {
                        compiledClass[1].push(this.buttons[i].class.split(/[\s]+/)[j])
                      }
                    }
  
                    if(compiledClass[0].length != 0){//FAClass
                      var stringFAClass = ""
                      for(var k = 0; k < compiledClass[0].length; k++){
                        stringFAClass += `${compiledClass[0][k]}${(k != compiledClass[0].length-1) ? " " : ""}`
                      }
                      customButtonFAClass[i] = stringFAClass;
                    }
                    if(compiledClass[1].length != 0){//Class
                      var stringClass = ""
                      for(var k = 0; k < compiledClass[1].length; k++){
                        stringClass += `${compiledClass[1][k]}${(k != compiledClass[1].length-1) ? " " : ""}`
                      }
                      customButtonClass[i] = stringClass;
                    }
                  }
  
                  if(this.buttons[i].style != null){//STYLE
                    customButtonStyle[i] = this.buttons[i].style;
                  }
  
                }
                this.customButtons.title = customButtonTitle;
                this.customButtons.variable = customButtonVariable;
                this.customButtons.class = customButtonClass;
                this.customButtons.style = customButtonStyle;
                this.customButtons.FAClass = customButtonFAClass;
              }
            }
          }
  
          //CHECK special_buttons
          if(this.special_buttons != null){
            if(!Array.isArray(this.special_buttons)){
              this.propsValid.valid = false;
              this.propsValid.reason = "special_buttons must be an array of String"
            } else {
              for(var i = 0; i < this.special_buttons.length; i++){
                if(typeof this.special_buttons[i] == "string"){
                  this.specialButtons.push({
                    title : this.toCapitalizedWords(this.special_buttons[i]),
                    variable : this.special_buttons[i]
                  })
                } else {
                  this.propsValid.valid = false;
                  this.propsValid.reason = "special_buttons must be an array of String"
                }
              }
            }
          }
  
          //CHECK fields
          if(this.fields != null){
            this.config.fieldPropsExist = true
            for(var i = 0; i < this.fields.length; i++){
              if(this.fields[i].title == null || this.fields[i].variable == null){
                this.propsValid.valid = false;
                this.propsValid.reason = "Every field must have a 'title' and a 'variable'"
                this.newError(JSON.stringify(this.fields[i]));
              }
            }
          }
  
          //CHECK disable_sort
          if(this.disable_sort != null){
            if(typeof this.disable_sort != 'boolean'){
              this.propsValid.valid = false;
              this.propsValid.reason = "disable_sort must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK infinite_scroll
          if(this.infinite_scroll != null){
            if(typeof this.infinite_scroll != 'boolean'){
              this.propsValid.valid = false;
              this.propsValid.reason = "infinite_scroll must be either a 'true' or a 'false' Boolean"
            } else if (this.infinite_scroll && this.pagination) {
              this.propsValid.valid = false;
              this.propsValid.reason = "'infinite_scroll' contradicts with 'pagination' prop"
            } else {
              this.config.infiniteScrollEnabled = this.infinite_scroll;
            }
          }
  
          //CHECK dummy_table
          if(this.dummy_table != null){
            if (typeof this.dummy_table == 'boolean') this.config.showDummy = this.dummy_table
            else {
              this.propsValid.valid = false;
              this.propsValid.reason = "dummy_table must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK indexing
          if(this.indexing != null){
            if (typeof this.indexing == 'boolean') this.config.indexing = this.indexing
            else {
              this.propsValid.valid = false;
              this.propsValid.reason = "indexing must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK process_data
          if(this.process_data != null){
            if (typeof this.process_data == 'string') this.config.processData = this.process_data
            else {
              this.propsValid.valid = false;
              this.propsValid.reason = "process_data must be an executable string"
            }
          }
  
          //CHECK fixed_header
          if(this.fixed_header != null){
            if (typeof this.fixed_header == 'boolean') this.config.fixedHeader = this.fixed_header
            else {
              this.propsValid.valid = false;
              this.propsValid.reason = "fixed_header must be either a 'true' or a 'false' Boolean"
            }
          }
  
          //CHECK tbody_height
          if(this.tbody_height != null){
            if (this.tbody_height.match(/[\d]+(%|em|px)/)) this.config.tbodyHeight = this.tbody_height
            else {
              this.propsValid.valid = false;
              this.propsValid.reason = "tbody_height must be either an 'em', 'px', or '%' height"
            }
          }
  
          //CHECK export_config
          if(this.export_config != null){
            if (this.export_config.name) this.config.exportFile.name = this.export_config.name
            if (this.export_config.type) this.config.exportFile.type = this.export_config.type
            if (this.export_config.all) this.config.exportFile.all = this.export_config.all
          }
  
          //IF EVERYTHING IS VALID, CONTINUE TO FETCH API
          if(this.propsValid.valid) this.fetchData(1);
        },
        async checkPropsPostAPI(){
  
          //IS THIS FIRST TIME FETCH API?
          if(!this.tableHeadersFetched){
            //CHECK buttons
            if(this.tableData.length > 0 && this.buttons != null){
              for(var i = 0; i < this.buttons.length; i++){
                if(this.buttons[i].variable != null && this.buttons[i].variable != '' && typeof this.tableData[0][this.buttons[i].variable] == 'undefined'){
                  this.propsValid.valid = false
                  this.propsValid.reason = `Button '${this.buttons[i].title}' of variable '${this.buttons[i].variable}' was not sent from the API Response`
                }
              }
            }
  
            //CHECK fields
            if(this.config.fieldPropsExist){
              var fieldsValid = true;
  
              var titles = [];
              var variables = [];
              var disableSort = new Array(this.fields.length).fill((this.disable_sort != null) ? this.disable_sort : false);
              var style_condition = new Array(this.fields.length).fill(null);
              var numberWithCommas = new Array(this.fields.length).fill(false);
              var dateFormat = new Array(this.fields.length).fill(null);
  
              //Loop Check Starts
              for(var i = 0; i < this.fields.length; i++){
                //Check if 'variable' exist in API Response
                if(this.tableData.length > 0 && typeof this.tableData[0][this.fields[i].variable] == 'undefined'){
                  this.propsValid.valid = false
                  this.propsValid.reason = `Field variable of '${this.fields[i].variable}' was not sent from the API Response`
                  return;
                }
  
                //Check 'disable_sort'
                if(typeof this.fields[i].disableSort != 'undefined'){
                  if(typeof this.fields[i].disableSort != 'boolean'){
                    this.propsValid.valid = false
                    this.propsValid.reason = `Field variable of '${this.fields[i].variable}' has an invalid 'disableSort' request`
                    return;
                  } else {
                    disableSort[i] = this.fields[i].disableSort;
                  }
                }
  
                //Check 'style_condition'
                if(typeof this.fields[i].style_condition != 'undefined'){
                  if(typeof this.fields[i].style_condition != 'object'){
                    this.propsValid.valid = false
                    this.propsValid.reason = `Field variable of '${this.fields[i].variable}' has an invalid 'style_condition' request`
                  } else {
                    var conditions = []
                    var style_keys = Object.keys(this.fields[i].style_condition)
                    for(var j = 0; j < style_keys.length; j++){
                      conditions.push({
                        'value' : style_keys[j],
                        'style' : this.fields[i].style_condition[style_keys[j]]
                      })
                    }
                    style_condition[i] = conditions;
                  }
                }
  
                //Check 'number_formatting'
                if(typeof this.fields[i].number_formatting != 'undefined'){
                  if(typeof this.fields[i].number_formatting != 'boolean'){
                    this.propsValid.valid = false
                    this.propsValid.reason = `Field variable of '${this.fields[i].variable}' has an invalid 'number_formatting' request`
                    return;
                  } else {
                    numberWithCommas[i] = this.fields[i].number_formatting;
                  }
                }
  
                //Check 'date_format'
                if(typeof this.fields[i].date_format != 'undefined'){
                  if(typeof this.fields[i].date_format != 'string'){
                    this.propsValid.valid = false
                    this.propsValid.reason = `Field variable of '${this.fields[i].variable}' has an invalid 'date_format' request`
                    return;
                  } else {
                    dateFormat[i] = this.fields[i].date_format;
                  }
                }
                titles.push(this.fields[i].title);
                variables.push(this.fields[i].variable);
              }
              //Loop Check Ends
  
              this.tableHeaders.originalTitles = titles;
              var compiledDisplay = []
  
              for(var i = 0; i < variables.length; i++){
                compiledDisplay.push({
                  title : titles[i],
                  variable : variables[i],
                  disableSort : disableSort[i],
                  style_condition : style_condition[i],
                  numberWithCommas : numberWithCommas[i],
                  dateFormat : dateFormat[i]
                })
              }
              this.tableHeaders.displayed = compiledDisplay
            } else {
              await this.processTableHeaders();
            }
          }
          this.changeSortTitle();
        },
        initialiseFilter(){
          if(!(typeof this.filter === 'object' && this.filter !== null)){
            this.filterUrl = '';
            return;
          }
          var keys = Object.keys(this.filter);
          let stringUrl = '';
          var queryParams = this.filter;
  
          for(var i = 0 ; i < keys.length; i++){
            if(!queryParams[keys[i]])
              continue;
  
            if(queryParams[keys[i]] == '' || queryParams[keys[i]].length == 0)
              continue 
  
            if((keys[i] == 'user_type') && queryParams[keys[i]] == 'All')
              continue;
            
            // if(keys[i] == 'start_hour' || keys[i] == 'end_hour')
            //   queryParams[keys[i]] += ":00";
            
            if([keys[i]] == 'start' || keys[i] == 'end') queryParams[keys[i]] = moment(queryParams[keys[i]]).format('Y-MM-DD')
            
  
            stringUrl += `&${keys[i]}=${queryParams[keys[i]]}`;
            
          }
          this.filterUrl = stringUrl;
        },
        async fetchData(page, isExport){
          if(this.config.substituteData){//IF 'api_url' has been substituted with data
            this.tableData = this.data;
            this.checkPropsPostAPI();
            return;
          }
  
          this.config.currentlyFetching = true;
  
          let vm = this;
          await this.initialiseFilter();
          let seperator = this.api_url.includes('?') ? '&' : '?'
  
          var url = `${this.api_url}${seperator}pagination=${(this.config.paginationExist) ? 'true' : 'false'}${this.filterUrl}`;
          
  
          if(this.config.paginationExist){
            url = `${url}&limit=${this.config.limitPerPage}${(this.config.by != null) ? '&order=' : ''}${(this.config.by != null) ? (this.config.order)?'ASC':'DESC' : ''}${(this.config.by != null) ? '&by=' + this.config.by : ''}`//ADDS LIMIT, ORDER, AND BY
  
            if(page)
              url = url + '&page=' + page;
            else
              url = url + '&page=1';
          }
          await this.$http.get(url)
          .then((resp)=>{
            var data = resp.data.data;
  
            //process data after api is called, if process_data props is sent
            if(vm.config.processData != null) eval(vm.config.processData);
  
            if(isExport){
              this.exportData = data;
            } else {
              if(vm.config.paginationExist){
                var meta = resp.data.meta;
              
                vm.config.currentPage = (meta.currentPage != null) ? meta.currentPage : meta.current_page;
                vm.config.maxPage = (meta.lastPage != null) ? meta.lastPage : (meta.last_page != null) ? meta.last_page : (data.length < this.config.limitPerPage) ? 0 : -1;//-1 Continue Infinite Scroll, 0 Stop Infinite Scroll
                vm.config.total = meta.total;
              }
  
              vm.tableData = (vm.config.infiniteScrollEnabled) ? vm.tableData.concat(data) : data; 
            }
          })
          .then(()=>{
            vm.checkPropsPostAPI();
          })
          .catch((err)=>{
            console.log(err)
          })
          .finally(()=>{
            vm.config.currentlyFetching = false;
          })
          return 'Export Complete';
        },
        async processTableHeaders(){
          // console.log(`${JSON.stringify(this.tableData)}; ${Array.isArray(this.tableData)}`);
          if(!Array.isArray(this.tableData)){
            this.newError('Data is not array!');
            return;
          } else if(this.tableData.length == 0) {
            this.newError('Data is empty!');
            return;
          }
  
          var titles = []
          var keys = Object.keys(this.tableData[0]);
  
          for(var i = 0; i < keys.length; i++){
            if(keys[i].includes("_")){
              var str = await this.capitalize(keys[i].split("_")[0])
              for(var j = 1; j < keys[i].split("_").length; j++){
                str += ` ${await this.capitalize(keys[i].split("_")[j])}`
              }
              titles.push(str);
            } else {
              titles.push(await this.capitalize(keys[i]))
            }
          }
  
          this.tableHeaders.originalTitles = titles;
  
          var compiledDisplay = []
  
          for(var i = 0; i < keys.length; i++){
            compiledDisplay.push({
              title : titles[i],
              variable : keys[i],
              disableSort : (this.config.paginationExist) ? ((this.disableSort != null) ? this.disableSort : false) : true,//FORCE DISABLE SORT IF NO PAGINATION
            })
          }
          this.tableHeaders.displayed.length = 0;
          this.tableHeaders.displayed = this.tableHeaders.displayed.concat(compiledDisplay); 
          // console.log(JSON.stringify(this.tableHeaders));
  
          this.tableHeadersFetched = true;
        },
        selectAndSort(sortVariable, disableSort){
          if(sortVariable == null || disableSort){
            this.newError('Sort Unavailable');
            return;
          }
  
          if(this.config.infiniteScrollEnabled) this.tableData.length = 0;
  
          if(this.config.by != sortVariable){
            this.config.by = sortVariable
            this.config.order = false
            this.fetchData(1)
          } else {
            this.config.order = !this.config.order
            if(this.config.order)
              this.fetchData(1)
            else
              this.fetchData(1)
          }
          
        },
        changeSortTitle(){
          for(var i = 0; i < this.tableHeaders.displayed.length; i++){
            // console.log(`${this.tableHeaders.displayed[i].variable} == ${this.config.by}`)
            if(this.config.by == this.tableHeaders.displayed[i].variable){
              if(this.config.order)
                this.tableHeaders.displayed[i].title = this.tableHeaders.originalTitles[i] + '▲'
              else
                this.tableHeaders.displayed[i].title = this.tableHeaders.originalTitles[i] + '▼'
            } else {
              this.tableHeaders.displayed[i].title = this.tableHeaders.originalTitles[i]
            }
          }
        },
        changePage(opt){//1 First, 5 previous, 6 next, 10 last
          switch(opt){
            case 1://laquo - First Page
              if(this.config.currentPage-1 > 0){
                this.fetchData(1);
              } else {
                this.newError("First Page Reached!");
              }
              break;
            case 5://lsaquo - Previous Page
              if(this.config.currentPage-1 > 0){
                this.fetchData(this.config.currentPage-1);
              } else {
                this.newError("First Page Reached!");
              }
              break;
            case 6://rsaquo - Next Page
              if(this.config.currentPage+1 <= this.config.maxPage){
                this.fetchData(this.config.currentPage+1);
              } else {
                this.newError("Last Page Reached!");
              }
              break;
            case 10://raquo - Last Page
              if(this.config.currentPage+1 <= this.config.maxPage){
                this.fetchData(this.config.maxPage);
              } else {
                this.newError("Last Page Reached!");
              }
              break;
            default:
              this.newError("Pagination Error, Read Documentation")
          }
        },
        loadingSeen(isVisible, entry){
          if(isVisible &&
            (this.config.currentPage < this.config.maxPage || this.config.maxPage == -1) &&
            !this.config.currentlyFetching) this.fetchData(this.config.currentPage+1);
        },
        async exportFile(){
          if (this.config.exportFile.all) {
            let message = 'Export Failed'
  
            this.config.paginationExist = false;
            message = await this.fetchData(1, true);
            this.config.paginationExist = true;
            message += "!"
            console.log(message);
          }
  
          let wb = XLSX.utils.book_new()
          var ws = XLSX.utils.json_to_sheet(this.exportData, {raw:true});
          XLSX.utils.book_append_sheet(wb, ws, 'Data')
  
          let exportFileName = `${this.config.exportFile.name}.${this.config.exportFile.type}`
          XLSX.writeFile(wb, exportFileName)
        }
      }
    }
  </script>
  
  <style scoped>
    .outerBox{
      padding: 0 20px;
    }
    .innerBox{
      border:1px solid #EEEEEE;
      border-radius:5px;
      background-color: white;
      /* box-shadow: 10px 10px 20px #E0E0E0; */
    }
    .tableTitle{
      text-align: center;
    }
    .sortable{
      cursor: pointer;
    }
    .tableContent{
      text-align: center;
      vertical-align: middle;
    }
  
    /* PAGINATION STYLE STARTS */
    .page-link{
      cursor: pointer;
    }
    .pageNumber .page-link:hover{
      background-color: white;
      cursor: default;
    }
    .disabled .page-link{
      background-color:#EEEEEE;
    }
    li .disabled:hover{
      cursor: default;
    }
    /* PAGINATION STYLE ENDS */
  
    .selectPerPage:active, .selectPerPage:hover {
      outline: none;
    }
  
    .specialButtons {
      display: flex;
      justify-content: space-between;
    }
  
    .fixedHeader tbody {
      display: block;
      /* max-height:200px; */
      overflow-y: auto;
    }
  
    .fixedHeader thead, .fixedHeader tbody tr {
      display: table;
      width: 100%;
      table-layout:fixed;
    }
  </style>