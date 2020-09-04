
import moment from 'moment'

var methods={

  errorPrint(errorMessage){//PRINTS ERROR IN RED COLOR
    var error = "%c" + errorMessage;
    console.log(error, 'color:#ff0000')
  },
  printTest(){//PRINTS THE WORD 'TEST'
    console.log("test");
  },
  printDate(date){
    if(date != null) return moment(date).format("DD MMM YY HH:mm")
    else return '-';
  },
  isMobile(){
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      return true;
    } else {
      return false;
    }
  },
  numberWithCommas(x) {
    return parseInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  },
  toCapitalizedWords(name){
    var words = name.match(/[A-Za-z][a-z]*/g) || [];
    return words.map(this.capitalize).join(" ");
  },
  capitalize(s){
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  },
  randomDate(start, end) {//example "2020-02-01 02:30:50" OR just "2020-02-01"
    var startDate = new Date(start)
    var endDate = new Date(end)

    var date = new Date(+startDate + Math.random() * (endDate - startDate));
    return date.toISOString().slice(0, 19).replace(/T/g, " ");
  },
  isRTL () {
    return document.documentElement.getAttribute('dir') === 'rtl' || document.body.getAttribute('dir') === 'rtl'
  },
  featureUnavailable(){
    this.$store.dispatch('triggerAlert', [false, ['Fitur Belum Tersedia']])
  },


  

  //Load Filter Options
  async loadFilterOptions () {
    var filterList = ['brand', 'type', 'model', 'color', 'laborer', 'laborerType', 'supplier', 'customer', 'sparepart', 'woSteps', 'month', 'year', 'insuranceType']
    var urlList = ['car/brand', 'car/type', 'car/model', 'car/color', 'labourer', 'labourer/type', 'supplier', 'customer', 'sparepart', 'steps', 'month', 'year', 'insurance_type']

    let monthName = ['January' , 'February' , 'March' , 'April', 'May', 'June' , 'July', 'August', 'September', 'October' , 'November', 'December']
    let exceptions = ['sparepart', 'laborerType', 'woSteps']//without sort by name and sort order descending
    var year = []

    //GET COMPANY PROFILE
    this.getCompanyProfile();

    for (var i = 0 ; i < filterList.length; i++) {
      //if filter exist, skip
      if(this.$store.state.filterOptions[filterList[i]] != null) continue;

      if (filterList[i] == 'month') {//month
        this.$store.dispatch('setMonth', monthName.map((mon, i) => ({value:i+1, name:mon})))
      } else if (filterList[i] == 'year') {//year
        for (var j = new Date().getFullYear(); j >= 2000; j--) year.push(j.toString())
        this.$store.dispatch('setYear', year)
      } else {//rest of filter
        var url = `/api/v1/masterData/${urlList[i]}?pagination=false`

        if (exceptions.indexOf(filterList[i]) === -1) //Exception
          url+=`&by=name&order=ASC`

        let filter = filterList[i]

        this.$http.get(url)
        .then((resp) => {
          var data = resp.data.data;

          if (filterList[i] == 'customer')
            for(var j in data) data[j].view = `${data[j].phone_number} - ${data[j].name}`

          this.$store.dispatch(`set${this.capitalize(filter)}`, data)
        })
        .catch(err => console.log(err))
      }
    }//FOR LOOP ENDS
  },
  getCompanyProfile(){
    this.$http.get('/api/v1/company_profile')
    .then((resp)=>{
      this.$store.dispatch(`setCompanyProfile`, resp.data.data)
    })
    .catch((err)=>{console.log(err);})
  },
}

export default methods;