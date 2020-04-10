<template>
    <span>
        <template>
        <fab :actions="fabActions"
            @alert="createFloatingIP()"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Connection to Servers
                    </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" style="padding-top:30px">
                <!-- GERAL -->
                <b-collapse
                    class="card highlight0"
                    animation="slide"
                    :open="isOpen == index"
                    @open="isOpen = index">
                    <div
                        slot="trigger"
                        slot-scope="props"
                        class="card-header"
                        role="button">
                        <p class="card-header-title highlight1">
                            Pick Server
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <div class="columns">
                                <b-switch
                                    v-model="justCreateFIP"
                                    :true-value="true"
                                    :false-value="false"
                                    outlined
                                    type="is-danger"
                                    @input="change()"
                                    >Just Create Floating IP</b-switch>
                                <b-select :disabled="justCreateFIP" class="column" placeholder="Select server" v-model="selectedServerId" expanded>
                                    <option 
                                        v-for="server in servers"
                                        :value="server.id"
                                        :key="server.id"
                                        >
                                        {{ server.name }}
                                    </option>
                                </b-select>
                                <b-select class="column" v-if="selectedServerId&&!justCreateFIP" placeholder="Select port" v-model="selectedServerPort" expanded>
                                    <option
                                        v-for="port in portsFromServer"
                                        :value="port"
                                        :key="port.id"
                                        >
                                        {{ port.id }}
                                    </option>
                                </b-select>
                                <b-select class="column" disabled v-else placeholder="Select Port" v-model="selectedServerPort" expanded>
                                    <option></option>
                                </b-select>
                            </div>
                        </div>      
                    </div>
                    <div class="content" style="margin-top:10px;margin-left:30px">
                    <b-field type="is-success">
                        <b-radio-button :disabled="justCreateFIP" type="is-info" v-model="toggleCreateFloatingIP"
                            native-value='false'
                            >
                            Use already existing Floating IP
                        </b-radio-button>
                        <b-radio-button type="is-danger" v-model="toggleCreateFloatingIP"
                            native-value='true'>
                            Create a new Floating IP
                        </b-radio-button>
                    </b-field>
                </div>
                <!-- CHOOSE FIP -->
                <b-collapse
                    v-if="toggleCreateFloatingIP=='false'"
                    style="margin-top:30px"
                    class="card highlight0"
                    animation="slide"
                    :open="isOpen == index"
                    @open="isOpen = index">
                    <div
                        slot="trigger"
                        slot-scope="props"
                        class="card-header"
                        role="button">
                        <p class="card-header-title highlight7">
                            Choose Floating IP
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="content columns has-text-centered">
                            <!-- Choose Private Network Or create? -->
                            <b-select style="margin-top:10px" class="column" placeholder="Select a Floating IP" v-model="selectedFloatingIp" expanded >
                                <option
                                    v-for="ip in floatingips"
                                    :value="ip"
                                    :key="ip.id"
                                    >
                                    {{ ip.description?ip.description:ip.id }}
                                </option>
                            </b-select>
                            <b-field label="Floating IP" label-position='' class="column">
                                {{selectedFloatingIp==undefined?'':selectedFloatingIp.floating_ip_address}}
                            </b-field>
                            <b-field label="Network" label-position='' class="column">
                                {{selectedFloatingIp==undefined?'':getNetworkName}}
                            </b-field>
                            <b-field label="Fixed IP associated" label-position='' class="column">
                                {{selectedFloatingIp==undefined?'':selectedFloatingIp.fixed_ip_address}}
                            </b-field>
                            <b-field label="Status" label-position='' class="column">
                                {{selectedFloatingIp==undefined?'':selectedFloatingIp.status}}
                            </b-field>
                        </div>      
                    </div>
                    
                </b-collapse>
                <!-- CREATE FIP -->
                <b-collapse
                    v-if="toggleCreateFloatingIP=='true'"
                    style="margin-top:30px"
                    class="card highlight0"
                    animation="slide"
                    :open="isOpen == index"
                    @open="isOpen = index">
                    <div
                        slot="trigger"
                        slot-scope="props"
                        class="card-header"
                        role="button">
                        <p class="card-header-title highlight5">
                            Create Floating IP
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="content">

                            <div class="columns">
                                <!-- Choose Private Network -->
                                <b-select style="margin-top:10px;margin-left:15px" class="column" placeholder="Select a router-external Network" v-model="selectedNetwork">
                                    <option
                                        v-for="network in networks"
                                        :value="network"
                                        :key="network.id"
                                        >
                                        {{ network.name }}
                                    </option>
                                </b-select>
                            </div>
                            <b-field class="column" label="Description"  label-position=''>
                                <b-input type="textarea" v-model="description" placeholder="Insert a description for the new server" value=""></b-input>
                            </b-field>
                            
                            
                            <!-- Create network, Criar router publico e adicionar à rede -->
                            <!-- Adicionar ao router uma interface e ligar essa interface à rede privada -->
                        </div>      
                    </div>
                    
                </b-collapse>
                </b-collapse>

                
            </div>
        </section>
    </span>
        
</template>

<script>
import fab from 'vue-fab'

export default {
    name: 'connection',
    components: {
        fab
    },
    props:[
        'ip',
        'user',
        'servers'

    ],
    data: () => ({
        loading:false,
        toggleCreateFloatingIP:'false',
        justCreateFIP:false,
        networks:[],
        selectedNetwork:null,
        selectedServerId:null,
        selectedServerPort:null,
        selectedFloatingIp:null,
        description:null,
        ports:[],
        isOpen: 0,
        index:0,
        floatingips:[],
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
    }),
    methods: {
        change(){
            if(this.justCreateFIP){
                this.toggleCreateFloatingIP='true'
            }
        },
        getFloatingIPs(){
            this.loading=true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                
                this.floatingips = response.data.floatingips;
                this.loading = false;
                console.log("floatingips")
                console.log(this.floatingips)
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Something went terribly wrong!", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loading = false;
            });
        },
        createFloatingIP(){
            this.loading=true;

            var data = {};

            if(this.toggleCreateFloatingIP=='true'){

                 data = {
                    'floatingip':{
                        'tenant_id': this.user.project.id,
                        'project_id':this.user.project.id,
                        'floating_network_id': this.selectedNetwork.id,
                        'description':this.description
                    }
                }

                this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips',data,
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {

                    if(!this.justCreateFIP){
                        if( !this.selectedServerPort || this.selectedServerPort.id==null){
                            this.error("No server/network port to associate the created Floating IP")
                            this.loading = false;
                            return;
                        }

                        var data = {
                            'floatingip':{
                                'port_id' :this.selectedServerPort.id,
                            }
                        }
                        this.axios.put('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips/'+response.data.floatingip.id+'',data,
                        {
                            headers: { 
                                'x-auth-token': this.user.token
                            }
                        }).then(() => {
                            this.$router.push('/home/servers');
                            this.$toasted.success("Floating IP created and server configured!", { 
                                theme: "outline", 
                                position: "top-right", 
                                duration : 5000
                            });
                            this.loading = false;
                        }).catch(error => {
                            console.log(error)
                            this.$toasted.error("Something went terribly wrong!", { 
                                theme: "outline", 
                                position: "top-right", 
                                duration : 5000
                                });
                                this.loading = false;
                        });
                    }
                    this.$toasted.success("Floating IP created!", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                    });
                    
                }).catch(error => {
                    console.log(error)
                    this.$toasted.error("Something went terribly wrong!", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                        });
                        this.loading = false;
                });
            } else{
                if(this.toggleCreateFloatingIP=='false'){

                    if( !this.selectedServerPort || this.selectedServerPort.id==null){
                        this.error("Please select a server and a network port")
                        this.loading = false;
                        return;
                    }

                    data = {
                        'floatingip':{
                            'port_id' :this.selectedServerPort.id,
                        }
                    }

                    this.axios.put('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips/'+this.selectedFloatingIp.id,data,
                    {
                        headers: { 
                            'x-auth-token': this.user.token
                        }
                    }).then(() => {
                        this.$router.push('/home/servers');
                        this.$toasted.success("IP configured!", { 
                            theme: "outline", 
                            position: "top-right", 
                            duration : 5000
                        });
                        this.loading = false;
                    }).catch(error => {
                        console.log(error)
                        this.$toasted.error("Something went terribly wrong!", { 
                            theme: "outline", 
                            position: "top-right", 
                            duration : 5000
                            });
                            this.loading = false;
                    });
                }
            }
        },
        getNetworksExternal(){
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/networks?router:external=true',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                
                this.networks = response.data.networks;
                console.log("networks")
                console.log(this.networks)
                this.loading = false;
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Something went terribly wrong!", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loading = false;
            });
        },
        getPorts(){
            this.loading=true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/ports',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                
                this.ports = response.data.ports;
                console.log("ports")
                console.log(this.ports)
                this.loading = false;
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Something went terribly wrong!", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loading = false;
            });
        },
        error(error_message){
            this.$toasted.error(error_message, { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
        },
    },
    computed: {
        portsFromServer(){
            var device_id = this.selectedServerId;
            return this.ports.filter(function(port) {
                return port.device_id == device_id ? true:false;
            });
        },
        getNetworkName(){
            var network_id = this.selectedFloatingIp.floating_network_id;
            var net =  this.networks.filter(function(network) {
                return network.id == network_id ? true:false;
            });
            return net[0].name;
        },
    },
    mounted(){
        this.getFloatingIPs();
        this.getNetworksExternal();
        this.getPorts();     
    }
}
</script>


<style>
    /* #carousel-list-item{
        position: relative;
        top: 0;
        transition: top ease 0.5s;
    } */
    .highlight0 {
        background:#bbb8ba48;
    }
    .highlight1 {
        background:#57525648;
    }
    .highlight2 {
        background:#d0f30dce;
    }
    .highlight3 {
        background:#2fe41756;
    }
    .highlight4 {
        background:#0c58e642;
    }
    .highlight5 {
        background:#f10e0e73;
    }
    .highlight6 {
        background:#00ccff7a;
    }
    .highlight7 {
        background:#0059ff7a;
    }

    div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 50px;
        font-size: 20px;
    }

</style>