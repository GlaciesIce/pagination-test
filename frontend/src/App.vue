<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created () {
      this.$http.interceptors.request.use((config) => {
        
        if(config.url.includes('?')) {
          let splitUrl = config.url.split("?")
          let queryUrl = splitUrl[1].split('&')

          for(var i = 0 ; i < queryUrl.length ; i++) {
            if(queryUrl[i].includes('start=')) {
              queryUrl[i] = queryUrl[i] + ' 00:00:00'
            }
            if(queryUrl[i].includes('end=')) {
              queryUrl[i] = queryUrl[i] + ' 23:59:59'
            }
          }

          queryUrl = queryUrl.join('&')
          config.url = splitUrl[0] + "?" +  queryUrl
        }

        if(!config.url.includes('/v1/masterData'))
          this.setLoading(true);

        return config;
      }, (error) => {
        this.setLoading(false);
        console.log(error)
        return Promise.reject(error);
      });
    },
    mounted () {

    },
    methods : {
      setLoading(isLoading){ 
        // if (isLoading) {
        //   this.refCount++;
        //   this.$swal({
        //     title: 'Loading.....'
        //   });
        //   this.$swal.showLoading();
        //   this.isLoading = true;
        // } else if (this.refCount > 0) {
        //   this.refCount--;
        //   this.$swal.close();
        //   this.isLoading = (this.refCount > 0);
        // }
        console.log('hi');
      },
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
