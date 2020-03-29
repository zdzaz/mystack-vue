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
      <span v-if="!loadingEdit&&!loadingDeleteServer&&!loading&&!loadingFlavors&&!loadingHypervisors&&!loadingImages&&!loadingNetworks&&!loadingServers&&!loadingZones&&!loadingProjects&&!loadingProjectsSwitch">
        <router-view :key="servers.length" @getServersAgain="getServers" @editserver="editServer" @bulkDeleteServer="bulkDeleteServer" @deleteserver="deleteServer" :availabilityZones="availabilityZones" :hypervisors="hypervisors" :images="images" :networks="networks" :flavors="flavors" :ip="ip" :user="user" :servers="servers"></router-view>
        <mynavbar :ip="ip" :user="user" :projects="projects" :servers="servers" @switchproject="switchProject"></mynavbar>
      </span>
      <span v-else>
          <img class="loading" src="./assets/loading.png">
      </span>
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
    loadingFlavors:false,
    loadingHypervisors:false,
    loadingImages:false,
    loadingNetworks:false,
    loadingServers:false,
    loadingZones:false,
    loadingProjects:false,
    loadingProjectsSwitch:false,
    loadingDeleteServer:false,
    loadingEdit:false,
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
                  },
                  "scope": {
                      "project": {
                          "id": "default"
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
      .then((response) => {
        this.user = response.data.token.user;
        this.user.token = response.headers['x-subject-token'];
        this.user.scope = "project";
        this.getProjects();
        this.loading = false;
        }).catch(err => {
          console.log(err);
          var error_message = "Somethign went wrong...";
          if(err == "Error: Request failed with status code 401"){
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
    getProjects(){
      this.loadingProjects = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/identity/v3/users/'+this.user.id+'/projects',{headers:{'x-auth-token': this.user.token}})
        .then(response => {
            this.projects = response.data.projects;

            if(!this.connected){
              this.user.project = this.projects[0];
              this.$router.push("/home");
            }
            this.getServers();
            this.getFlavors();
            this.getNetworks();
            this.getImages();
            this.getZones();
            this.getHypervisors();
            this.connected=true;
            
            this.loadingProjects = false;

        }).catch(response => {
            var error_message = "Somethign went wrong...";
            if(response == "Error: Request failed with status code 401"){
              error_message = "Invalid credentials..."
            }
            this.$toasted.error(error_message, { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loadingProjects = false;
          });
    },
    switchProject(newProject){
      this.loadingProjectsSwitch = true;
      this.user.project = newProject;

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
                },
                "scope": {
                    "project": {
                        "id": this.user.project.id
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
      ).then(response => {
        this.getProjects();
        this.user.token = response.headers['x-subject-token'];
        this.getServers();
        this.getFlavors();
        this.getNetworks();
        this.getImages();
        this.getZones();
        this.getHypervisors();
        this.$router.push("/home");
        this.$toasted.success("Switched project scope!", { 
          theme: "outline", 
          position: "top-right", 
          duration : 5000
        });
        this.loadingProjectsSwitch = false;
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
          this.loadingProjectsSwitch = false;
        });
      this.$forceUpdate();
    },
    getServers(){
        this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/servers/detail',
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then(response => {
            this.servers = response.data.servers;
            this.$forceUpdate();
        }).catch(error => {
            console.log(error)
            var error_message = "Somethign went wrong...";
            if(error == "Error: Request failed with status code 404"){
            error_message = "No server with that id..."
            }
            this.$toasted.error(error_message, { 
            theme: "outline", 
            position: "top-right", 
            duration : 5000
            });
        });
    },
    getFlavors(){
      this.loadingFlavors = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/flavors/detail',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          this.flavors = response.data.flavors;
          this.loadingFlavors = false;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loadingFlavors = false;
      });
    },
    getNetworks(){
      this.loadingNetworks = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/networks/',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          
          this.networks = response.data.networks;
          this.loadingNetworks = false;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loadingNetworks = false;
      });
    },
    getImages(){
      this.loadingImages = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/image/v2/images',
      {
        headers: { 
            'x-auth-token': this.user.token
        }
      }).then(response => {
          this.images = response.data.images;
          this.loadingImages = false;
      }).catch(error => {
        console.log(error)
        this.$toasted.error("Something went terribly wrong!", { 
              theme: "outline", 
              position: "top-right", 
              duration : 5000
            });
            this.loadingImages = false;
      });
    },
    getZones(){
      this.loadingZones = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/os-availability-zone',
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then(response => {
            this.availabilityZones = response.data.availabilityZoneInfo;
            this.loadingZones = false;
        }).catch(error => {
            console.log(error)
            this.$toasted.error("No subnetworks associated!", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
                this.loadingZones = false;
        });

    },
    getHypervisors(){
        if(this.user.scope=="system"){
          this.loadingHypervisors = true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/os-hypervisors',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                
                this.hypervisors = response.data.hypervisors;
                this.loadingHypervisors = false;
            }).catch(() => {
                this.$toasted.error("No permission to get hypervisors", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loadingHypervisors = false;
            });
          }
    },
    deleteServer(id){
      this.loadingDeleteServer = true;
      this.axios.delete('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/servers/'+id+'',
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then((response) => {
            this.$toasted.success("Deleted instance with success", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
            console.log(response)
            this.servers = this.servers.filter(s => s.id !== id);
            this.loadingDeleteServer = false;
            this.$forceUpdate();
        }).catch(error => {
            console.log(error)
            this.$toasted.error("Could not delete server", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
                this.loadingDeleteServer = false;
        });
        
        this.$forceUpdate();
    },
    bulkDeleteServer(serversToDelete){
      serversToDelete.forEach(element => {
        this.deleteServer(element.id);
      });
    },
    editServer(edited){
      this.loadingEdit = true;
      var server = {};
      
      if(edited.accessIPv4){
        server.accessIPv4 = edited.accessIPv4;
      }
      if(edited.accessIPv6){
        server.accessIPv6 = edited.accessIPv6;
      }
      if(edited.description){
        server.description = edited.description;
      }
      if(edited.name){
        server.name = edited.name;
      }
      server['OS-DCF:diskConfig'] = edited['OS-DCF:diskConfig'];
      var data = {"server":server};
      console.log(data)
      this.axios.put('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2/servers/'+edited.id+'',data,
        {
            headers: { 
                'x-auth-token': this.user.token
            }
        }).then((response) => {
            console.log(response)
            this.$toasted.success("Edited instance with success", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
            this.getServers();
            this.loadingEdit = false;
            this.$forceUpdate();
        }).catch(error => {
            console.log(error)
            this.$toasted.error("Could not edit server", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
                this.loadingEdit = false;
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
  mounted(){},
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

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    margin:-60px 0 0 -60px;
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
