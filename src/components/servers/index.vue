<template>
    <span>
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
                
                <b-carousel-list repeat v-model="current" :data="filteredServers" :has-drag="false" :items-to-show="5" style="padding-bottom:30px">
                    <template slot="item" slot-scope="server">
                        <div :class="server.index==current?'up':'down'" class="card"  @click="server.index==current?'':info(server.index,server)">
                            <div class="card-image">
                                <figure class="image is-5by4">
                                    <img src="../../assets/vm.png">
                                </figure>
                                <b-tag v-if="server.list.tag" type="is-danger" rounded style="position: absolute; top: 0;"><b><p class="title is-6">{{ server.list.tag[0] }}</p></b></b-tag>
                            </div>
                            <div class="card-content">
                                <div class="content">
                                    <p class="has-text-centered title is-size-4">{{ server.list.name }}</p>
                                    <b disabled :class="server.list.status=='ACTIVE'?'has-text-success':'has-text-danger'" class="is-size-6">{{ server.list.status }} </b>&
                                    <b :class="poweredStates[server.list['OS-EXT-STS:power_state']].class"> {{poweredStates[server.list['OS-EXT-STS:power_state']].name}}</b>
                                    <p class="has-text-info">Zone: {{servers[current]['OS-EXT-AZ:availability_zone']}}</p>
                                    <button @click="go('/home/flavors')" class="is-primary button is-small">Flavor {{ server.list.flavor.id}}</button>
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
                        <b-table checkable :checked-rows.sync="checkedRowsDelete" :data="servers" :columns="bulk_columns"></b-table>
                </section>
                <div class="has-text-right" style="padding-right:30px;padding-top:30px">
                    <button class="button" type="button" @click="bulk_delete=false">Close</button>
                    <button  class="button is-danger"  @click.prevent.stop="bulkDelete()">Bulk Delete</button>
                </div>
                
            </div>
        </section>
        <section v-if="current>=0">
            <fab :actions="fabActions"
                @edit="toggleEditServer=true"
                @delete="confirmDelete()"
            ></fab>
            <!-- EDIT -->
            <b-modal :active.sync="toggleEditServer"
                    has-modal-card
                    trap-focus
                    aria-role="dialog"
                    aria-modal>
                <editserver @editserverevent="editServerList" :server="servers[current]"></editserver>
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

                <!-- ADDRESSES INFO BUTTON -->
                <span v-if="this.servers[current].status=='ERROR'||this.servers[current].status=='DELETED'">
                    <div  class="columns">
                        <div class="column">
                            <b-button class="is-danger"><b>FAULT</b></b-button>
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
                    <div class="column">
                        <b-button @click="toggleAddresses=!toggleAddresses" class="is-success"><b>Addresses:</b></b-button>
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
                    <div class="column">
                        <b-button @click="toggleVolumes=!toggleVolumes" class="is-dark"><b>Volumes:</b></b-button>
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
                    <div class="column">
                        <b-button @click="toggleTimeInfo=!toggleTimeInfo" class="is-link"><b>Timing Information:</b></b-button>
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
                    <div class="column">
                        <b-button @click="toggleOSInfo=!toggleOSInfo" class="is-info"><b>OS Related Info:</b></b-button>
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
                    <div class="column">
                        <b-button @click="toggleAdmin=!toggleAdmin" class="is-danger"><b>Admin Information:</b></b-button>
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
        'servers'
    ],
    data: () => ({
            // upHere:[''],
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