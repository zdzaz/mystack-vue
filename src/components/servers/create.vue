<template>
    <span>
        <template>
        <fab :actions="fabActions"
            @alert="createServer"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Create Server
                </h1>
                </div>
            </div>
        </section>
        {{json}}
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
                            Geral
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
                                <b-field label="Name" label-position='' class="column">
                                    <b-input v-model="newServer.name" placeholder="my-new-server" required></b-input>
                                </b-field>
                                <b-field label="Tag" label-position='' class="column">
                                    <b-input v-model="newServer.tag" placeholder="tagx"></b-input>
                                </b-field>
                                <b-field label="Admin Password" label-position='' class="column">
                                    <b-input type="password" v-model="newServer.adminPass" placeholder="admin password"></b-input>
                                </b-field>
                                <i class="fas fa-question is-dark" @click="alert"></i>
                            </div>
                            
                            <b-field label="Description"  label-position=''>
                                <b-input type="textarea" v-model="newServer.description" placeholder="Insert a description for the new server" value=""></b-input>
                            </b-field>

                            <div class="columns">
                                <!-- AVAIL ZONE -->
                                <b-field  v-if="this.availabilityZones.length>0" label="Availability Zone" label-position='' class="column is-one-third" >
                                    <b-select placeholder="Select a image" v-model="selectedAvailabilityZone" expanded>
                                        <option
                                            v-for="zone in availabilityZones"
                                            :value="zone.zoneName"
                                            :key="zone.zoneName"
                                            >
                                            {{ zone.zoneName }}
                                        </option>
                                    </b-select>
                                </b-field>
                                <!-- HYPERVISOR -->
                                <b-field v-if="hypervisors.length>0" label="Hypervisor" label-position='' class="column">
                                    <b-select placeholder="Select a Hypervisor" v-model="selectedHypervisor" expanded>
                                        <option
                                            v-for="hypervisor in hypervisors"
                                            :value="hypervisor"
                                            :key="hypervisor.id"
                                            >
                                            {{ hypervisor.hypervisor_hostname }}
                                        </option>
                                    </b-select>
                                </b-field>
                                <b-field v-if="selectedHypervisor.servers!==undefined&&selectedHypervisor.servers.length>0" label="Host" label-position='' class="column">
                                    <b-select placeholder="Select a Hypervisor" v-model="selectedHost" expanded>
                                        <option
                                            v-for="host in selectedHypervisor.servers"
                                            :value="host"
                                            :key="host.uuid"
                                            >
                                            {{ host.name }}
                                        </option>
                                    </b-select>
                                </b-field>
                            </div>
                            
                        </div>
                        <!-- MULTIPLE SERVERS?-->
                        <div class="content" style="">
                            <b-field type="">
                                <b-radio-button type="is-dark" v-model="multipleServers"
                                    native-value='no'
                                    >
                                    One Instance
                                </b-radio-button>
                                <b-radio-button type="is-dark" v-model="multipleServers"
                                    native-value='yes'>
                                    Multiple Instances
                                </b-radio-button>
                            </b-field>
                        </div>
                        <div v-if="multipleServers=='yes'" class="columns">
                            <b-field required label="Minimum # Instances" label-position='' class="column">
                                <b-input type="number" min=1 v-model="min_count"></b-input>
                            </b-field>
                            <b-field label="Maximum # Instances" label-position='' class="column">
                                <b-input type="number" min=1 v-model="max_count"></b-input>
                            </b-field>
                        </div>

                        <!-- FLAVOR OPTIONS -->
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
                                <p class="card-header-title highlight2">
                                    Flavors
                                </p>
                                <a class="card-header-icon">
                                    <b-icon
                                        :icon="props.open ? 'menu-down' : 'menu-up'">
                                    </b-icon>
                                </a>
                            </div>
                            <!-- FLAVOR OPTIONS -->
                            <div class="card-content">
                                <div class="content columns">
                                    <b-field label="Flavor pick" label-position='' class="column is-one-third" >
                                        <b-select placeholder="Select a flavor" v-model="selectedFlavor" expanded>
                                            <option
                                                v-for="flavor in flavors"
                                                :value="flavor.id"
                                                :key="flavor.id"
                                                >
                                                {{ flavor.name }}
                                            </option>
                                        </b-select>
                                    </b-field>
                                    <b-field label="RAM" label-position='' class="column">
                                        {{currentFlavor[0]==undefined?'':currentFlavor[0].ram}} MB
                                    </b-field>
                                    <b-field label="Disk" label-position='' class="column">
                                        {{currentFlavor[0]==undefined?'':currentFlavor[0].disk}} GB
                                    </b-field>
                                    <b-field label="V-CPUS" label-position='' class="column">
                                        {{currentFlavor[0]==undefined?'':currentFlavor[0].vcpus}} vitual CPU{{currentFlavor[0]!=undefined?(currentFlavor[0].vcpus==1?'':'s'):''}}
                                    </b-field>
                                </div>
                            </div>
                        </b-collapse>
        
                        
                    </div>
                    
                </b-collapse>
                <!-- NETWORK -->
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
                        <p class="card-header-title highlight3">
                            Network
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <!-- CHOOSE NET CONF TYPE -->
                    <div class="card-content">
                        <div class="content">
                            <b-field type="is-success">
                                <b-radio-button type="is-success" v-model="chooseNetwork"
                                    native-value='list'
                                    >
                                    Network From List
                                </b-radio-button>
                                <b-radio-button type="is-success" v-model="chooseNetwork"
                                    native-value='manual'>
                                    Manual
                                </b-radio-button>
                                <b-radio-button type="is-success" v-model="chooseNetwork"
                                    native-value='auto'
                                    >
                                    Automatic
                                </b-radio-button>
                            </b-field>
                        </div>
                        <!-- NET FROM LIST -->
                        <div v-if="chooseNetwork=='list'" class="content columns">
                            <b-field label="Network pick(s)" label-position='' class="column is-one-third" >
                                <b-select multiple placeholder="Select a flavor" v-model="selectedNetworks" expanded>
                                    <option
                                        v-for="network in networks"
                                        :value="network"
                                        :key="network.id"
                                        >
                                        {{ network.name }}
                                    </option>
                                </b-select>
                            </b-field>
                            <span class="column">
                                <b-field style="padding-top:20px; padding-left:20px" class="tile is-ancestor" v-for="(network) in selectedNetworks" :key="network.id">
                                    <div class="tile is-vertical is-8">
                                        <span style="font-weight:bold">{{network.name}}</span>
                                        <div class="tile columns">
                                            <span class="column is-one-quarter" :style="network.status=='ACTIVE'?'color:green':'color:red'">Status {{network.status=='ACTIVE'?'Active':'Not Active'}}</span>
                                            <span class="column is-one-third" :style="network.admin_state_up==true?'color:green':'color:red'">Admin State {{network.admin_state_up?'Activated':'Not Activated'}}</span>
                                            <span class="column is-one-fifth" style="font-weight:bold">MTU: {{network.mtu}}</span>
                                            <span class="column" v-if="network.description" style="font-weight:bold">Description: {{network.description}}</span>                                        

                                        </div>
                                            <span class="tile">
                                            <button class="button block has-background-white" @click="getSubnetworkDetails(network.id,network.subnets);">Subnet Information</button>
                                            </span>
                                            <b-message class="" :active.sync="network.subnetwork_details==undefined?false:true" aria-close-label="Close message">
                                                <div v-for="subnetwork in network.subnetwork_details" :key="subnetwork.id">
                                                    <p v-if="subnetwork.name" style="font-weight:bold">Name: {{subnetwork.name}}</p>
                                                    <p v-if="subnetwork.description">Description: {{subnetwork.description}}</p>
                                                    <p v-if="subnetwork.project_id">Project ID: {{subnetwork.project_id}}</p>
                                                    <p v-if="subnetwork.ip_version">IPv{{subnetwork.ip_version}} Version</p>
                                                    <p>Subnet Pool? {{subnetwork.subnetpool_id==null?'No':'Yes'}}</p>
                                                    <p>DHCP {{subnetwork.enable_dhcp==true?'Enabled':'Not Enabled'}}</p>
                                                    <p v-if="subnetwork.gateway_ip">Gateway IP: {{subnetwork.gateway_ip}}</p>
                                                    <p v-if="subnetwork.cidr">CIDR: {{subnetwork.cidr}}</p>
                                                </div>
                                            </b-message>
                                        
                                        ______________________________________________________________________________________________________
                                    </div>
                
                                </b-field>
                            </span>
                        </div>
                        <!-- NET MANUAL -->
                        <div v-if="chooseNetwork=='manual'" class="columns">
                            <b-field label="Access IPv4" label-position='' class="column">
                                <b-input type="text" v-model="newServer.accessIPv4"></b-input>
                            </b-field>
                            <b-field label="Access IPv4" label-position='' class="column">
                                <b-input type="text" v-model="newServer.accessIPv6"></b-input>
                            </b-field>
                        </div>
                    </div>
                </b-collapse>
                <!-- DISKS -->
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
                        <p class="card-header-title highlight4">
                            Instance Startup Source
                        </p>
                        <a class="card-header-icon">
                            <b-icon
                                :icon="props.open ? 'menu-down' : 'menu-up'">
                            </b-icon>
                        </a>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <b-field>
                                <b-radio-button v-model="selectedStartup"
                                    native-value="image">
                                    From Image
                                </b-radio-button>
                                <b-radio-button v-model="selectedStartup"
                                    native-value="volume"
                                    >
                                    From Volume
                                </b-radio-button>
                                <b-radio-button v-model="selectedStartup"
                                    native-value="instance_snap"
                                    disabled>
                                    From Instance Snapshot
                                </b-radio-button>
                                <b-radio-button v-model="selectedStartup"
                                    native-value="volume_snap"
                                    disabled>
                                    From Volume Snapshot
                                </b-radio-button>
                            </b-field>
                        </div>
                        <!-- FROM IMAGE -->
                        <b-collapse
                            v-if="selectedStartup=='image'"
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
                                    Images
                                </p>
                                <a class="card-header-icon">
                                    <b-icon
                                        :icon="props.open ? 'menu-down' : 'menu-up'">
                                    </b-icon>
                                </a>
                            </div>
                            <div class="card-content">
                                <div class="content columns">
                                    <b-field label="Image pick" label-position='' class="column is-one-third" >
                                        <b-select placeholder="Select a image" v-model="selectedImage" expanded>
                                            <option
                                                v-for="image in images"
                                                :value="image"
                                                :key="image.id"
                                                >
                                                {{ image.name }}
                                            </option>
                                        </b-select>
                                    </b-field>
                                    <span class="column">
                                        <b-field style="padding-top:20px; padding-left:20px" class="">
                                            <div v-if="selectedImage" class="">
                                                <div class=" columns">
                                                    <b-field label="Status" label-position='' class="column">
                                                        <span :style="selectedImage.status=='active'?'color:green':'color:red'">{{selectedImage.status=='active'?'Active':'Not Active'}}</span>
                                                    </b-field>
                                                    <b-field label="Disk Format" label-position='' class="column">
                                                        {{selectedImage.disk_format}}                                                   
                                                    </b-field>
                                                    <b-field label="Visibility" label-position='' class="column">
                                                        {{selectedImage.visibility}}                                                   
                                                    </b-field>
                                                    <b-field label="Size" label-position='' class="column">
                                                        {{selectedImage.size}}                                                   
                                                    </b-field>
                                                    <b-field  v-if="selectedImage.tags.length>0" label="Tags" label-position='' class="column">
                                                        <b-tag type="is-danger" v-for="(tag,index) in selectedImage.tags" :key="index" rounded>{{tag}}</b-tag>
                                                    </b-field>
                                                </div>
                                            </div>
                                        </b-field>
                                    </span>
                                </div>
                            </div>
                        </b-collapse>
                        <b-collapse
                            v-if="selectedStartup=='image'"
                            class="card highlight0"
                            animation="slide"
                            :open="isOpen == index"
                            @open="isOpen = index">
                            <div
                                slot="trigger"
                                slot-scope="props"
                                class="card-header"
                                role="button">
                                <p class="card-header-title highlight6">
                                    Volume
                                </p>
                                <a class="card-header-icon">
                                    <b-icon
                                        :icon="props.open ? 'menu-down' : 'menu-up'">
                                    </b-icon>
                                </a>
                            </div>
                            <div class="card-content">
                                <div class="content columns">
                                    <span class="column">
                                        <b-field v-if="selectedStartup=='image'">
                                            <b-radio-button type="is-info" v-model="createNewVolume"
                                                native-value='yes'>
                                                Create new volume
                                            </b-radio-button>
                                            <b-radio-button type="is-info" v-model="createNewVolume"
                                                native-value="no"
                                                >
                                                Use already created volume
                                            </b-radio-button>
                                        </b-field>
                                    </span>
                                </div>
                                <span v-if="createNewVolume=='yes'" class="">
                                    <b-field label="Volume Size (B)" label-position='' class="column is-half">
                                        <b-input type="number" v-model="newVolume.size"></b-input>
                                    </b-field>
                                </span>
                                <span v-if="createNewVolume=='no'" class="columns">
                                    <b-field label="Volume pick" label-position='' class="column" >
                                        <b-select placeholder="Select a image" v-model="selectedVolume" expanded>
                                            <option
                                                v-for="volume in volumes"
                                                :value="volume"
                                                :key="volume.id"
                                                >
                                                {{ volume.name }}
                                            </option>
                                        </b-select>
                                    </b-field>
                                    <b-field style="padding-top:20px; padding-left:20px" class="column">
                                        <div v-if="selectedVolume" class="">
                                            <div class=" columns">
                                                <b-field label="Status" label-position='' class="column">
                                                    <span :style="selectedImage.status=='active'?'color:green':'color:red'">{{selectedVolume.name}}</span>
                                                </b-field>
                                            </div>
                                        </div>
                                    </b-field>
                                </span>
                            </div>
                        </b-collapse>
                    </div>
                </b-collapse>
            </div>
        </section>
    </span>
        
</template>

<script>
import fab from 'vue-fab'

export default {
    name: 'create',
    components: {
        fab
    },
    props:[
        'ip',
        'user',
        'flavors',
        'networks',
        'images',
        'volumes',
        'availabilityZones',
        'hypervisors'
    ],
    data: () => ({
        loading:false,
        isOpen: 0,
        index:0,
        isActiveAdminPassword: false,
        isActive:[],
        newServer:{},
        newVolume:{},
        selectedFlavor:0,
        chooseNetwork:'list',
        selectedNetworks:[],
        selectedStartup:'',
        createNewVolume:'',
        selectedImage:'',
        selectedVolume:'',
        volumes_dummy:[{name:'vol1'},{name:'vol2'}],
        selectedAvailabilityZone:{},
        selectedHost:{},
        selectedHypervisor:{},
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
        multipleServers:'no',
        min_count:1,
        max_count:1,
        json:''
    }),
    methods: {
        // To check the progress of the request, make a GET /servers/{id} request. This call returns a progress attribute, which is a percentage value from 0 to 100.
        //The Location header returns the full URL to the newly created server and is available as a self and bookmark link in the server representation.
        
        createServer(){
            this.loading = true;
            console.log(this.selectedAvailabilityZone)
            var data = {
                'server':{
                    'name':this.newServer.name,
                    'tag':this.newServer.tag==''?null:this.newServer.tag,
                    'adminPass':this.newServer.adminPass==''?null:this.newServer.adminPass,
                    'description':this.newServer.description==''?null:this.newServer.description,
                    'flavorRef':this.selectedFlavor,
                    'availability_zone':this.selectedAvailabilityZone==''?null:this.newServer.selectedAvailabilityZone,
                }
            }

            if(this.multipleServers=='yes'){
                if(this.min_count > this.max_count){
                    this.error("Invalid min/max amount of instances");
                    return;
                }
                data.server.min_count = this.min_count>=1?this.min_count:1;
                data.server.max_count = this.max_count>=1?this.max_count:1;
            }

            if(this.chooseNetwork=='list'){
                data.server.networks=[];

                this.selectedNetworks.forEach((n)=>{
                    var network = {
                        'uuid':n.id,
                    }
                    data.server.networks.push(network)
                });
            } else{
                if(this.chooseNetwork=='manual'){
                    data.server.accessIPv4 = this.newServer.accessIPv4;
                    data.server.accessIPv6 = this.newServer.accessIPv6;
                } else{
                    data.server.networks = 'auto';
                }
            }

            if(this.selectedStartup=='image'){
                data.server.imageRef=this.selectedImage.id;
            }

            if(this.createNewVolume=='yes'){
                // Criar novo volume!!! com o tamanho this.newVolume.size
            }

            if(this.selectedHypervisor!=''){
                data.server.hypervisor_hostname=this.selectedHypervisor.hypervisor_hostname;
            }
            if(this.selectedHost!=''){
                data.server.host=this.selectedHost.name;
            }
            
            console.log(data)
            this.json = data;
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/servers',data,
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                    console.log("Created Server");
                    console.log(response);

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
        alert() {
            this.$buefy.dialog.alert('The admin access password is optional, if not specified one will be automatically generated')
        },
        error(error_message){
            this.$toasted.error(error_message, { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
        },
        getSubnetworkDetails(network_id, subnetworks){

            if(subnetworks.length>0){
                this.networks.find(x=> x.id===network_id)['subnetwork_details']=[];
            } else{
                return;
            }
            subnetworks.forEach((item)=>{
                this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/subnets/'+item+'',
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {
                    console.log("Got them subnetworks details");
                    console.log()
                    this.networks.find(x=> x.id===network_id)['subnetwork_details'].push(response.data.subnet);
                    this.$forceUpdate();
                }).catch(error => {
                    console.log(error)
                    this.$toasted.error("No subnetworks associated!", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                        });
                });


            });
        },
        
    },
    computed: {
        currentFlavor(){
            return this.flavors.filter(obj => {
                return obj.id === this.selectedFlavor;
            })
        }
    },
    mounted(){

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

    div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 50px;
        font-size: 20px;
    }

</style>