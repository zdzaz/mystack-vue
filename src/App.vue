<template>
  <span>
    <div v-if="!connected" class="container" style=" text-align: center">
      <img height="30%" width="30%" alt="Vue logo" src="./assets/logo.png">
      <div class="columns">
        <div class="column" centered>
        </div>
        <b-field class="column" centered>
          <b-input type="number" required v-model="ip[0]" rounded></b-input>
        </b-field>
        <b-field class="column" centered>
          <b-input type="number" required v-model="ip[1]" rounded></b-input>
        </b-field>
        <b-field class="column" centered>
          <b-input type="number" required v-model="ip[2]" rounded></b-input>
        </b-field>
        <b-field class="column" centered>
          <b-input type="number" required v-model="ip[3]" rounded></b-input>
        </b-field>
        <div class="column" centered>
        </div>
      </div>
      <div v-show="proceed" class="columns" style="text-align: center">
        <div class="column" centered>
        </div>
          <b-field class="column" label="Username">
              <b-input value="admin" required v-model="credentials.name" maxlength="20"></b-input>
          </b-field>

          <b-field class="column" label="Password">
              <b-input value="StrongAdminSecret" required v-model="credentials.password" type="password" password-reveal>
              </b-input>
          </b-field>
        <div class="column" centered>
        </div>
      </div>
      
      <b-button @click="connect()" size="is-large" :disabled="proceed==false||loading==true?true:false" :type="proceed==false?'is-danger':'is-success'">
        {{message_button}}
      </b-button>
    </div>
    <div v-else>
      <router-view :availabilityZones="availabilityZones" :hypervisors="hypervisors" :images="images" :networks="networks" :flavors="flavors" :ip="ip" :user="user" :servers="servers"></router-view>
      <mynavbar :ip="ip" :user="user" :projects="projects" :servers="servers" @switchproject="switchProject"></mynavbar>
    </div>
  </span>
    
</template>

<script>

import Nav from './components/navbar.vue'

export default {
  name: 'App',
  components: {
    'mynavbar': Nav,
  },
  data: () => ({
    loading:false,
    credentials:{
      name:"demo",
      password:"StrongAdminSecret",
      token: "",
    },
    user:{},
    projects:{},
    servers:{},
    flavors:{},
    networks:{},
    images:{},
    availabilityZones:[],
    hypervisors:[],
    ip:[127,0,0,1],
    connected:false,
  }),
  methods:{
    connect(){
      //Call OpenStack, connect to OpenStack Machine
      //if all went well, keep going, else error message
      this.loading = true;
      this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/identity/v3/auth/tokens',{
          "auth": {
              "identity": {
                  "methods": [
                      "password"
                  ],
                  "password": {
                      "user": {
                          "name": this.credentials.name,
                          "domain": {
                              "name": "Default"
                          },
                          "password": this.credentials.password,
                      }
                  }
              }
          },
      },
        {
          headers: {
            'Content-Type' : 'application/json',
          },
        }
      )
      .then(response => {
        console.log("Got the Login");
        this.user = response.data.token.user;
        this.user.token = response.headers['x-subject-token'];


        this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/identity/v3/users/'+this.user.id+'/projects',{headers:{'x-auth-token': this.user.token}})
        .then(response => {
            console.log("Got the projects");
            
            this.projects = response.data.projects;
            this.user.project = this.projects[0];
            this.getServers();
            this.getFlavors();
            this.getNetworks();
            this.getImages();
            this.getZones();
            this.getHypervisors();
            this.$router.push("/home");
            this.connected=true;

            this.$toasted.success("Login successful!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loading = false;

        }).catch(response => {
            console.log(response);
            var error_message = "Somethign went wrong...";
            if(response == "Error: Request failed with status code 401"){
              error_message = "Invalid credentials..."
            }
            this.$toasted.error(error_message, { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loading = false;
          });
        }).catch(response => {
          console.log(response);
          var error_message = "Somethign went wrong...";
          if(response == "Error: Request failed with status code 401"){
            error_message = "Invalid credentials..."
          }
          this.$toasted.error(error_message, { 
            theme: "outline", 
            position: "top-right", 
            duration : 5000
          });
          this.loading = false;
        });
    },
    switchProject(newProject){
      this.user.project = newProject;
      this.getServers();
      this.getNetworks();
      this.getFlavors();
      this.getImages();
      this.$forceUpdate();
    },
    getServers(){
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/servers',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          console.log("Got them servers");
          this.servers = response.data;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
      });
    },
    getFlavors(){
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/flavors/detail',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          console.log("Got them flavors");
          this.flavors = response.data.flavors;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
      });
    },
    getNetworks(){
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/networks/',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          console.log("Got them networks");
          this.networks = response.data.networks;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
      });
    },
    getImages(){
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/image/v2/images',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          console.log("Got them images");
          this.images = response.data.images;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
      });
    },
    getZones(){
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/os-availability-zone',
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then(response => {
            console.log("Got them availability zones");
            this.availabilityZones = response.data.availabilityZoneInfo;
        }).catch(error => {
            console.log(error)
            this.$toasted.error("No subnetworks associated!", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
        });

    },
    getHypervisors(){
        this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/os-hypervisors',
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then(response => {
            console.log("Got them hypervisors");
            this.hypervisors = response.data.hypervisors;
        }).catch(() => {
            this.$toasted.error("No permission to get hypervisors", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
        });

    },
  },
  computed:{
    proceed() {
      if(this.ip[0]>=0 && this.ip[0]<255&&this.ip[1]>=0 && this.ip[1]<255&&this.ip[2]>=0 && this.ip[2]<255&&this.ip[3]>=0 && this.ip[3]<255){
        return true;
      }
      return false;
    },
    message_button(){
      if(this.loading){
        return "Connecting to server...";
      }
      if(this.proceed){
        return "Login to OpenStack";
      } else{
        return "Fill OpenStack Server's IP";
      }
      
    },
  },
  mounted(){
    
  },
  created(){
      this.$router.push("/");
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
  margin-top: 60px;
}
</style>
