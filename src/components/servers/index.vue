<template>

    <span>
        <span v-if="!loading">
            <section class="hero is-light is-bold">
                <div class="hero-body">
                    <div class="container">
                    <h1 class="title">
                        Servers
                    </h1>
                    </div>
                </div>
            </section>
            <section>
                <div class="container" style="padding-top:30px">
                    <b-field grouped group-multiline position="is-centered" style="padding-bottom:30px">
                        <b-field label="Filter by name">
                            <b-autocomplete
                                v-model="search_name"
                                :data="filteredServerNames"
                                placeholder="e.g. server1"
                                icon="magnify"
                                clearable
                                @select="option => selected = option">
                                <template slot="empty">No results found</template>
                            </b-autocomplete>
                        </b-field>
                        <b-field label="Filter by ID">
                            <b-input v-model="search_id"/>
                        </b-field>
                        <b-field label="Search by Tag">
                            <b-input v-model="search_tag"/>
                        </b-field>
                        <b-field label>
                        </b-field>
                        <b-field label="Bulk Delete">
                            <button class="button is-danger" @click="bulk_delete = true"> <a href="#delete" style="color:white">Select Instances</a> </button>
                        </b-field>
                    </b-field>
                    
                    <b-carousel-list  icon-size="is-large"  repeat v-model="current" :data="filteredServers" :items-to-show="5" style="padding-bottom:30px">
                        <template slot="item" slot-scope="server">
                            <div :class="server.index==current?'up':'down'" class="card" @dblclick="toggleActionServer=true"  @click="server.index==current?'':info(server.index,server)">
                                <div class="card-image">
                                    <figure class="image is-5by4">
                                        <img src="../../assets/OSNovaServer.png">
                                    </figure>
                                    <b-tag v-if="server.list.tag" type="is-danger" rounded style="position: absolute; top: 0;"><b><p class="title is-6">{{ server.list.tag[0] }}</p></b></b-tag>
                                </div>
                                <div class="card-content" >
                                    <div class="content">
                                        <p class="has-text-centered title is-size-5">{{ server.list.name }}</p>
                                        <b disabled :class="server.list.status=='ACTIVE'?'has-text-success':'has-text-danger'" class="is-size-6">{{ server.list.status }} </b>&
                                        <b :class="poweredStates[server.list['OS-EXT-STS:power_state']].class"> {{poweredStates[server.list['OS-EXT-STS:power_state']].name}}</b>
                                        <p class="has-text-info">Zone: {{servers[current]['OS-EXT-AZ:availability_zone']}}</p>
                                        <button @click="go('/home/flavors')" class="is-primary button is-small">Flavor {{ server.list.flavor.id.length>5?server.list.flavor.id.substring(0,5)+'...':server.list.flavor.id}}</button>
                                        <button @click="go(server.list.image==''?'/home/volumes':'/home/images')" class="button is-small is-dark">{{ server.list.image==""?'Booted from drive':"Booted Image"}}</button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </b-carousel-list>
                </div>
            </section>
            <section id="delete" v-if="bulk_delete">
                <div class="container" style="padding-bottom:40px;padding-left:30px;padding-top:30px">
                    <div class="columns">
                        <div class="column">
                            <b class="is-size-3	">Bulk Delete Instances</b> 
                        </div>
                    </div>
                    <section>
                            <b-table checkable :checked-rows.sync="checkedRowsDelete" checkbox-position="right" :data="servers" :columns="bulk_columns"></b-table>
                    </section>
                    <div class="has-text-right" style="padding-right:30px;padding-top:30px">
                        <button class="button" type="button" @click="bulk_delete=false">Close</button>
                        <button :disabled="checkedRowsDelete.length<=0"  class="button is-danger"  @click.prevent.stop="bulkDelete()">Bulk Delete</button>
                    </div>
                </div>
            </section>

            <section v-if="current>=0">
                <fab :actions="fabActions"
                    @edit="toggleEditServer=true"
                    @delete="confirmDelete()"
                    @fip="scrollMeTo('fip')"
                ></fab>
                <!-- EDIT -->
                <b-modal :active.sync="toggleEditServer"
                        has-modal-card
                        trap-focus
                        aria-role="dialog"
                        aria-modal>
                    <editserver @editserverevent="editServerList" :server="servers[current]"></editserver>
                </b-modal>
                <!-- ACTIONS -->
                <b-modal :active.sync="toggleActionServer"
                        has-modal-card
                        trap-focus
                        aria-role="dialog"
                        aria-modal>
                        <div class="columns">

                            <!-- UNLOCK -->
                            <figure v-on:mouseover="mouseover('Unlock')" v-on:mouseleave="mouseover('')" v-if="servers[current].locked">  class="image is-128x128 column">
                                <a><img @click="actionServer('unlock')" class="" src='../../assets/unlock.png'></a>
                            </figure>

                            <!-- LOCK -->
                            <figure v-on:mouseover="mouseover('Lock')" v-on:mouseleave="mouseover('')" v-else class="image is-128x128 column">
                                <a><img @click="actionServer('lock')" class="" src='../../assets/lock.png'></a>
                            </figure>

                            <!-- STOP -->
                            <figure v-on:mouseover="mouseover('Stop')" v-on:mouseleave="mouseover('')" v-if="poweredStates[servers[current]['OS-EXT-STS:power_state']].name=='Running'" class="image is-128x128 column">
                                <a><img @click="actionServer('os-stop')"  class="is-rounded" src="../../assets/stop.png"></a>
                            </figure>

                            <!-- START -->
                            <figure v-on:mouseover="mouseover('Start')" v-on:mouseleave="mouseover('')" v-if="servers[current].status!='SUSPENDED'&&poweredStates[servers[current]['OS-EXT-STS:power_state']].name=='Shutdown'" class="image is-128x128 column">
                                <a><img @click="actionServer('os-start')"  class="is-rounded" src='../../assets/start.png'></a> 
                            </figure>

                            <!-- RESUME from suspended -->
                            <figure v-on:mouseover="mouseover('Resume')" v-on:mouseleave="mouseover('')" v-if="servers[current].status=='SUSPENDED'" class="image is-128x128 column">
                               <a><img @click="actionServer('resume')" class="is-rounded" src="../../assets/start.png"></a>
                            </figure>

                            <!-- SUSPEND -->
                            <figure v-on:mouseover="mouseover('Suspend')" v-on:mouseleave="mouseover('')" v-else class="image is-128x128 column">
                               <a> <img @click="actionServer('suspend')" class="is-rounded" src="../../assets/suspend.png"></a>
                            </figure>

                            <!-- REBOOT -->
                            <figure v-on:mouseover="mouseover('Reboot')" v-on:mouseleave="mouseover('')" v-if="poweredStates[servers[current]['OS-EXT-STS:power_state']].name=='Running'" class="image is-128x128 column">
                               <a> <img @click="actionServer('reboot')" class="is-rounded" src="../../assets/reboot.png"></a>
                            </figure>

                            <!-- HARD REBOOT -->
                            <figure v-on:mouseover="mouseover('Hard Reboot')" v-on:mouseleave="mouseover('')" v-else class="image is-128x128 column">
                                <a><img @click="actionServer('hard_reboot')" class="is-rounded" src="../../assets/reboot.png"></a>
                            </figure>

                            <!-- UNPAUSE -->
                            <figure v-on:mouseover="mouseover('Unpause')" v-on:mouseleave="mouseover('')" v-if="poweredStates[servers[current]['OS-EXT-STS:power_state']].name=='Paused'" class="image is-128x128 column">
                                <a><img @click="actionServer('unpause')" class="is-rounded" src="../../assets/start.png"></a>
                            </figure>

                            <!-- PAUSE -->
                            <figure v-on:mouseover="mouseover('Pause')" v-on:mouseleave="mouseover('')" v-else class="image is-128x128 column">
                                <a><img @click="actionServer('pause')" class="is-rounded" src="../../assets/pause.png"></a>
                            </figure>
                        </div>
                        
                        <span class="columns" style="margin-top:20px">
                            <div v-if="messageAction!=''" class=" column is-one-third">
                            </div>
                            <b-button v-if="messageAction!=''" type="is-primary" size="is-medium" expanded>
                                <b>{{messageAction}} </b>
                            </b-button>
                            <div v-if="messageAction!=''" class=" column is-one-third">
                            </div>
                        </span>
                        
                </b-modal>
                <!-- DISPLAY -->
                <div v-if="servers.length>0" class="container" style="padding-bottom:40px;padding-left:30px;padding-top:30px">
                    <div class="columns">
                        <div class="column">
                            <b class="is-size-3	">{{servers[current].name}}</b> 
                            <p>ID: {{ servers[current].id }} </p>
                        </div>
                        <div v-if="servers[current].description" class="column">
                            <p>Description: {{ servers[current].description }} </p>
                        </div>
                    </div>

                    <!-- ERROR INFO BUTTON -->
                    <span v-if="this.servers[current].status=='ERROR'||this.servers[current].status=='DELETED'">
                        <div  class="columns">
                            <div class="column is-one-fifth">
                                <b-button class="is-danger" expanded><b>FAULT</b></b-button>
                            </div>
                        </div>
                        <!--ERROR INFO -->
                        <div style="padding-left:40px;" v-if="servers[current].fault">
                            <div class="container  columns" v-if="servers[current].fault.code||servers[current].fault.created||servers[current].fault.message||servers[current].fault.details">
                                <div class="column">
                                    <b>Fault Code:</b> <span v-if="servers[current].fault.code">{{servers[current].fault.code}}</span><span v-else>- - - -</span>
                                </div>
                                <div class="column">
                                    <b>Fault Message:</b> <span v-if="servers[current].fault.message" >{{servers[current].fault.message}}</span><span v-else>- - - -</span>
                                </div>
                                <div class="column">
                                    <b>Fault Created:</b> <span v-if="servers[current].fault.created" >{{servers[current].fault.created}}</span><span v-else>- - - -</span>
                                </div>
                                <div class="column">
                                    <b>Fault Details:</b> <span v-if="servers[current].fault.details" >{{servers[current].fault.details}}</span><span v-else>- - - -</span>
                                </div>
                            </div>
                            <div v-else class="columns">
                                <b>No information on the fault</b>
                            </div>
                        </div>
                    </span>
                    
                    <!-- ADDRESSES INFO BUTTON -->
                    <div  class="columns">
                        <div class="column is-one-fifth">
                            <b-button @click="toggleAddresses=!toggleAddresses" class="is-success" expanded><b>Addresses:</b></b-button>
                        </div>
                    </div>
                    <!--ADDRESSES INFO -->
                    <div v-show="toggleAddresses" style="padding-left:40px;">
                        <div class="container  columns" v-if="servers[current].accessIPv4||servers[current].accessIPv6">
                            <div class="column">
                                <b>AccessIPv4:</b> <span v-if="servers[current].accessIPv4" class="">{{servers[current].accessIPv4}}</span><span v-else>- - - -</span>
                            </div>
                            <div class="column">
                                <b>AccessIPv6:</b> <span v-if="servers[current].accessIPv6" class="">{{servers[current].accessIPv6}}</span> <span v-else>- - - -</span>
                            </div>
                            <div class="column">
                            </div>
                            <div class="column">
                            </div>
                        </div>
                        <div class="columns" v-if="Object.keys(servers[current].addresses).length>0" >
                            <div v-for="(type,key) in servers[current].addresses" :key="key">
                                <div class="column">
                                    <b>{{key}}</b>
                                    <div v-for="(address,index) in type" :key="index">
                                        <div class="column" v-for="(value,key) in address" :key="key">
                                            {{key.charAt(0).toUpperCase() + key.slice(1)}}: {{value}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- VOLUME RELATED INFO BUTTON -->
                    <div class="columns">
                        <div class="column is-one-fifth" >
                            <b-button @click="toggleVolumes=!toggleVolumes" class="is-dark" expanded><b>Volumes:</b></b-button>
                        </div>
                    </div>
                    <!-- VOLUME RELATED INFO -->
                    <div v-show="toggleVolumes" style="padding-left:40px;">
                        <div class="columns">
                            <div v-if="servers[current]['os-extended-volumes:volumes_attached'].length>0" class="column">
                                <b>Volumes Attached:</b>
                                <div v-for="(volume,index) in servers[current]['os-extended-volumes:volumes_attached']" :key="index">
                                    <div class="column">
                                        <a @click="go('/home/volumes')">Volume ID: {{volume.id}} </a>
                                    </div>
                                    <div class="column">
                                        Delete on termination: {{volume.delete_on_termination==true?'True':'False'}}
                                    </div>
                                </div>
                            </div>
                            <div v-if="servers[current]['OS-DCF:diskConfig']" class="column">
                                <b>Disk Configuration:</b> {{servers[current]['OS-DCF:diskConfig']}}
                            </div>
                        </div>
                    </div>

                    <!-- TIMING INFO BUTTON -->
                    <div class="columns">
                        <div class="column is-one-fifth">
                            <b-button @click="toggleTimeInfo=!toggleTimeInfo" class="is-link" expanded><b>Timing Information:</b></b-button>
                        </div>
                    </div>
                    <!-- TIMING INFO -->
                    <div v-show="toggleTimeInfo" style="padding-left:40px;">
                        <div class="columns">
                            <div class="column">
                                <b>Created:</b> <p v-if="servers[current].created" class="">{{servers[current].created}}</p>
                            </div>
                            <div class="column">
                                <b>Updated:</b> <p v-if="servers[current].updated" class="">{{servers[current].updated}}</p>
                            </div>
                            <div class="column" >
                                <b>Launched:</b> <p v-if="servers[current]['OS-SRV-USG:launched_at']" class="has-text-success">{{servers[current]['OS-SRV-USG:launched_at']}}</p>
                            </div>
                            <div class="column has-text-warning">
                                <b v-if="servers[current]['OS-SRV-USG:terminated_at']">Terminated:</b><p>{{servers[current]['OS-SRV-USG:terminated_at']}}</p>
                            </div>
                        </div>
                    </div>

                    <!-- OS RELATED INFO BUTTON -->
                    <div class="columns">
                        <div class="column is-one-fifth">
                            <b-button @click="toggleOSInfo=!toggleOSInfo" class="is-info" expanded><b>OS Related Info:</b></b-button>
                        </div>
                    </div>
                    <!-- OS RELATED INFO -->
                    <div v-show="toggleOSInfo" style="padding-left:40px;">
                        <div class="columns">
                            
                            <div v-if="servers[current]['userID']" class="column">
                                <b>User ID:</b> <p>{{servers[current]['userID']}}</p>
                            </div>
                            <div v-if="servers[current]['hostId']" class="column">
                                <b>Host ID:</b> <p>{{servers[current]['hostId']}}</p>
                            </div>
                            <div v-if="servers[current]['tenant_id']" class="column">
                                <b>Tenant ID:</b><p>{{servers[current]['tenant_id']}}</p>
                            </div>
                            <div v-if="servers[current]['OS-EXT-STS:task_state']" class="column">
                                <b>Task State:</b><p>{{servers[current]['OS-EXT-STS:task_state']}}</p>
                            </div>
                            <div v-if="servers[current]['OS-EXT-STS:vm_state']" class="column">
                                <b>VM State:</b><p>{{servers[current]['OS-EXT-STS:vm_state']}}</p>
                            </div>

                            
                        </div>
                    </div>

                    <!-- ADMIN INFO BUTTON -->
                    <div  class="columns">
                        <div class="column is-one-fifth">
                            <b-button @click="toggleAdmin=!toggleAdmin" class="is-danger" expanded><b>Admin Information:</b></b-button>
                        </div>
                    </div>
                    <!-- ADMIN INFO -->
                    <div v-show="toggleAdmin" style="padding-left:40px;">
                        <div v-if="servers[current]['OS-EXT-SRV-ATTR:hostname'] || servers[current]['OS-EXT-SRV-ATTR:kernel_id'] || servers[current]['OS-EXT-SRV-ATTR:ramdisk_id'] || servers[current]['OS-EXT-SRV-ATTR:root_device_name'] ||  servers[current]['OS-EXT-SRV-ATTR:instance_name'] || servers[current]['OS-EXT-SRV-ATTR:host'] || servers[current]['OS-EXT-SRV-ATTR:hypervisor_hostname'] " class="columns">
                            
                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:host']" class="column">
                                <b>Host Name:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:host']}}</p>
                            </div>

                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:hypervisor_hostname']" class="column">
                                <b>Hypervisor Name:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:hypervisor_hostname']}}</p>
                            </div>

                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:instance_name']" class="column">
                                <b>Instance Name:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:instance_name']}}</p>
                            </div>

                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:hostname']" class="column">
                                <b>Hostname of the instance when booted:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:hostname']}}</p>
                            </div>

                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:kernel_id']" class="column">
                                <b>Kernel ID:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:kernel_id']}}</p>
                            </div>
                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:ramdisk_id']" class="column">
                                <b>RAM disk ID:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:ramdisk_id']}}</p>
                            </div>
                            <div v-if="servers[current]['OS-EXT-SRV-ATTR:root_device_name']" class="column">
                                <b>Root device name:</b><p>{{servers[current]['OS-EXT-SRV-ATTR:root_device_name']}}</p>
                            </div>

                        </div>
                        <div v-else><b>No administrative information to show</b></div>
                    </div>
                </div>

            </section>
        </span>
        <span v-else>
            <img class="loading" src="../../assets/loading.png">
        </span>
    </span>
    
        
</template>

<script>
import fab from 'vue-fab'
import editserver from './edit.vue'


export default {
    name: 'index',
    components: {
        fab,
        editserver
    },
    props:[
        'ip',
        'user',
        'flavors',
        'servers',
        'networks'
    ],
    data: () => ({
            messageAction:'',
            loading:false,
            toggleActionServer:false,
            checkedRowsDelete:[],
            bulk_columns:[
                {
                        field: 'id',
                        label: 'ID',
                    },
                    {
                        field: 'name',
                        label: 'Name',
                    },
                    {
                        field: 'status',
                        label: 'Status',
                    },
            ],
            bulk_delete:false,
            toggleEditServer:false,
            toggleAddresses:true,
            toggleVolumes:false,
            toggleTimeInfo: false,
            toggleOSInfo: false,
            toggleAdmin: false,
            isEmpty: false,
            checkboxPosition: 'left',
            checkedRows: [],
            values:1,
            current:0,
            search_name:"",
            search_id:"",
            search_tag:"",
            message:null,
            details:null,
            poweredStates:[
                {name: 'No State', class: ''},
                {name: 'Running', class: 'has-text-success'},
                {name: '', class: ''},
                {name: 'Paused', class: 'has-text-warning'},
                {name: 'Shutdown', class: 'has-text-success'},
                {name: '', class: ''},
                {name: 'Crashed', class: 'has-text-danger'},
                {name: 'Suspended', class: 'has-text-warning'},
            ],
            fabActions: [
            // {
            //     name: 'fip',
            //     icon: 'wifi'
            // },
            {
                name: 'edit',
                icon: 'create'
            },
            {
                name: 'delete',
                icon: 'delete_forever'
            },
        ],
    }),
    methods: {
        // getPort(){
        //      this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/ports?device_id='+this.servers[this.current].id+'',
        //         {
        //             headers: { 
        //                 'x-auth-token': this.user.token
        //             }
        //         }).then(response => {
        //             console.log(response)
        //         }).catch(error => {
        //             console.log(error)
        //             this.$toasted.error("No ports available for that server", { 
        //                 theme: "outline", 
        //                 position: "top-right", 
        //                 duration : 5000
        //                 });
        //         });
        // },
        // createFloatingIP(){
        //     this.floatingip.tenant_id = this.user.project.id;
        //     this.floatingip.project_id = this.user.project.id;
        //     var data = {};
        //     data.floatingip = this.floatingip;
        //     console.log(data)

        //     this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips',data,
        //         {
        //             headers: { 
        //                 'x-auth-token': this.user.token
        //             }
        //         }).then(response => {
        //             console.log(response)
        //         }).catch(error => {
        //             console.log(error)
        //             this.$toasted.error("No floating IPs could be created", { 
        //                 theme: "outline", 
        //                 position: "top-right", 
        //                 duration : 5000
        //                 });
        //         });
            
        // },
        // scrollMeTo(refName) {
        //     this.floatingAddrToggle = true;
        //     this.getPort();
        //     var element = this.$refs[refName];
        //     var top = element.offsetTop;

        //     window.scrollTo(0, top);

        // },
        mouseover(message){
            this.messageAction = message;
        },    
        actionServer(action){

            this.loading = true;

            var data = {};

            if(action=='hard_reboot'){
                data={
                    'reboot':{
                        'type':'HARD'
                    }
                }
            } else{
                if(action=='reboot'){
                    data={
                        'reboot':{
                            'type':'SOFT'
                        }
                    }
                } else{
                    data[action] = null;
                }
            } 

            console.log("sdfsdfsdfdfdsfsd")
            console.log(data)
            
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/servers/'+this.servers[this.current].id+'/action',data,
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {
                    console.log('action succeeded')
                    console.log(response)
                    this.toggleActionServer = false;
                    this.loading = false;
                    this.alertActionSuccess();

                }).catch(error => {
                    console.log(error)
                    this.loading = false;
                    this.toggleActionServer = false;
                    this.alertActionFail();

                });

        },
        confirmDelete() {
            this.$buefy.dialog.confirm({
                title: 'Deleting Instance',
                message: 'Are you sure you want to delete this instance? <p> <b>' + this.servers[this.current].name+'</b></p>',
                confirmText: 'Yes, I\'m sure',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => this.deleteServer()
            })
        },
        deleteServer(){
            this.$emit('deleteserver',this.servers[this.current].id);
        },
        bulkDelete(){
            this.$emit('bulkDeleteServer',this.checkedRowsDelete);
        },
        editServerList(edited){
            this.$emit('editserver',edited);
        },
        go(route) {
            this.$router.push(route);
        },
        info(value) {
            this.current = value;
        },
        toggleUp(index){
            console.log("togle")
            console.log(index)
            console.log(this.upHere)
            this.upHere[index]=='0'?'1':'0';
        },
        getFloatingIP(){
            //  =
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+':9696/v2.0/floatingips',
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {
                    this.floatingIPs = response.data.floatingips;
                }).catch(error => {
                    console.log(error)
                    this.$toasted.error("No floating IPs could be reached", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                        });
                });
        },
        alertActionSuccess() {
            this.$buefy.dialog.alert({
                title: 'Action on server',
                type: 'is-success',
                message: 'Your request has been <b>Accepted</b>!',
                confirmText: 'Cool!'
            })
        },
        alertActionFail() {
            this.$buefy.dialog.alert({
                title: 'Action on server',
                type: 'is-danger',
                message: 'Your request has been <b>Not Accepted</b>',
                confirmText: 'Damn!'
            })
        },
    },
    computed: {
        filteredServerNames() {
            var search_for_name = this.search_name;
            var arrayNames = this.servers.map(({ name }) => name);
			if(search_for_name === "") {
				return arrayNames;
			} else {
				return arrayNames.filter(function(arrayName) {
                    var regex = new RegExp(search_for_name, 'gi');
					return arrayName.match(regex) === null ? false:true;
				});
			}
		},
        filteredServers() {
            var search_for_name = this.search_name;
            var search_for_id = this.search_id;
            var search_for_tag = this.search_tag;

			if(search_for_name === "") {
                if(search_for_id === ""){
                    if(search_for_tag ===""){
                        return this.servers;
                    } else{
                        return this.servers.filter(function(server) {
                        return server.id === search_for_tag;
                        }
                   )}
                } else{
                   return this.servers.filter(function(server) {
                        return server.id ===search_for_id;
                        }
                   )}
                } else {
				return this.servers.filter(function(server) {
                    var regex = new RegExp(search_for_name, 'gi');
                    var boolean = server.name.match(regex) === null ? false:true;
                    if(search_for_id === ""){
                        if(search_for_tag==="") {
                            return boolean;
                        } else{
                            return boolean && server.tag === search_for_tag;
                        }
                    } else{
                        return boolean && server.id === search_for_id;
                    }
				});
			}
		}
    },
    mounted(){
        if(this.servers){
            this.server_name_list = this.servers.map(({ name }) => name)
        }
        this.getFloatingIP();
        this.$emit('getServersAgain');
    },
    updated(){
        this.server_name_list = this.servers.map(({ name }) => name)
    }
}
</script>

<style>
.up {
    transition: 0.25s ease-in;
    transition: 0.25s ease-out;
    transform: translateY(15px);
    background-color: #d6f5f5;

}
.down {
    transition: 0.25s ease-out;
    transform: translateY(0px);
}

</style>