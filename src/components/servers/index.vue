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
                </b-field>
                <b-carousel-list v-model="current" :data="filteredServers" :has-drag="false" :items-to-show="5" style="padding-bottom:30px">
                    <template slot="item" slot-scope="server">
                        <!-- <transition name="up"> -->
                            <!-- :class="upHere[server.index]=='0'?'':'up'"  @mouseover="toggleUp(server.index)" @mouseout="toggleUp(server.index)" -->
                        <div class="card"  @click="info(server.index,server)">
                            <div class="card-image">
                                <figure class="image is-5by4">
                                    <a><img src="../../assets/vm.png"></a>
                                </figure>
                                <b-tag type="is-danger" rounded style="position: absolute; top: 0;"><b>VM</b></b-tag>
                            </div>
                            <div class="card-content">
                                <div class="content">
                                    <p class="title is-6">{{ server.index }}</p>
                                    <p class="title is-6">{{ server.list.name }}</p>
                                    <p class="subtitle is-7">{{ server.list.id }}</p>
                                </div>
                            </div>
                        </div>
                        <!-- </transition> -->
                    </template>
                </b-carousel-list>
             </div>
        </section>
        <section>
            <div class="container" style="padding-bottom:40px;padding-left:30px;">
                {{server_details_dummy[current]}}
            </div>
        </section>
        
    </span>
        
</template>

<script>
export default {
    name: 'index',
    props:[
        'ip',
        'user'
    ],
    data: () => ({
            // upHere:[''],
            columns: [
                        {
                            field: 'id',
                            label: 'ID',
                            width: '40',
                            numeric: true,
                            sticky: true,
                            headerClass: 'is-sticky-column-one',
                            cellClass: "is-sticky-column-one"
                        },
                        {
                            field: 'name',
                            label: 'Name',
                        },
                    ],
            isEmpty: false,
            checkboxPosition: 'left',
            checkedRows: [],
            values:1,
            servers_dummy: [
                {
                    "id": "22c91117-08de-4894-9aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "hippo"
                },
                {
                    "id": "22c91117-08d869aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "cavalinho"
                },
                {
                    "id": "22c91117-08de-4dg9aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "boomer"
                },
                {
                    "id": "22c9147-08de-4894-9aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "im-speed"
                },
                {
                    "id": "22c911123-08de-4894-9aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "oxygenio"
                },
                {
                    "id": "22c91119-08de-4894-9aa9-6ef382400985",
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/22c91117-08de-4894-9aa9-6ef382400985",
                            "rel": "bookmark"
                        }
                    ],
                    "name": "new-server-test"
                }
            ],
            server_details_dummy:[{
                    "OS-DCF:diskConfig": "AUTO",
                    "OS-EXT-AZ:availability_zone": "nova",
                    "OS-EXT-SRV-ATTR:host": "compute",
                    "OS-EXT-SRV-ATTR:hostname": "new-server-test",
                    "OS-EXT-SRV-ATTR:hypervisor_hostname": "fake-mini",
                    "OS-EXT-SRV-ATTR:instance_name": "instance-00000001",
                    "OS-EXT-SRV-ATTR:kernel_id": "",
                    "OS-EXT-SRV-ATTR:launch_index": 0,
                    "OS-EXT-SRV-ATTR:ramdisk_id": "",
                    "OS-EXT-SRV-ATTR:reservation_id": "r-t61j9da6",
                    "OS-EXT-SRV-ATTR:root_device_name": "/dev/sda",
                    "OS-EXT-SRV-ATTR:user_data": "IyEvYmluL2Jhc2gKL2Jpbi9zdQplY2hvICJJIGFtIGluIHlvdSEiCg==",
                    "OS-EXT-STS:power_state": 1,
                    "OS-EXT-STS:task_state": null,
                    "OS-EXT-STS:vm_state": "active",
                    "OS-SRV-USG:launched_at": "2019-04-23T15:19:10.855016",
                    "OS-SRV-USG:terminated_at": null,
                    "accessIPv4": "1.2.3.4",
                    "accessIPv6": "80fe::",
                    "addresses": {
                        "private": [
                            {
                                "OS-EXT-IPS-MAC:mac_addr": "00:0c:29:0d:11:74",
                                "OS-EXT-IPS:type": "fixed",
                                "addr": "192.168.1.30",
                                "version": 4
                            }
                        ]
                    },
                    "config_drive": "",
                    "created": "2019-04-23T15:19:09Z",
                    "description": null,
                    "flavor": {
                        "disk": 1,
                        "ephemeral": 0,
                        "extra_specs": {},
                        "original_name": "m1.tiny",
                        "ram": 512,
                        "swap": 0,
                        "vcpus": 1
                    },
                    "hostId": "2091634baaccdc4c5a1d57069c833e402921df696b7f970791b12ec6",
                    "host_status": "UP",
                    "id": "0e12087a-7c87-476a-8f84-7398e991cecc",
                    "image": {
                        "id": "70a599e0-31e7-49b7-b260-868f441e862b",
                        "links": [
                            {
                                "href": "http://openstack.example.com/6f70656e737461636b20342065766572/images/70a599e0-31e7-49b7-b260-868f441e862b",
                                "rel": "bookmark"
                            }
                        ]
                    },
                    "key_name": null,
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2.1/6f70656e737461636b20342065766572/servers/0e12087a-7c87-476a-8f84-7398e991cecc",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/0e12087a-7c87-476a-8f84-7398e991cecc",
                            "rel": "bookmark"
                        }
                    ],
                    "locked": true,
                    "locked_reason": "I don't want to work",
                    "metadata": {
                        "My Server Name": "Apache1"
                    },
                    "name": "new-server-test",
                    "os-extended-volumes:volumes_attached": [],
                    "progress": 0,
                    "security_groups": [
                        {
                            "name": "default"
                        }
                    ],
                    "server_groups": [],
                    "status": "ACTIVE",
                    "tags": [],
                    "tenant_id": "6f70656e737461636b20342065766572",
                    "trusted_image_certificates": null,
                    "updated": "2019-04-23T15:19:11Z",
                    "user_id": "fake"
            },
            {
                    "OS-DCF:diskConfig": "MANUAL",
                    "OS-EXT-AZ:availability_zone": "velho",
                    "OS-EXT-SRV-ATTR:host": "computee",
                    "OS-EXT-SRV-ATTR:hostname": "old-server-prod",
                    "OS-EXT-SRV-ATTR:hypervisor_hostname": "true-enormous",
                    "OS-EXT-SRV-ATTR:instance_name": "instance-00000001",
                    "OS-EXT-SRV-ATTR:kernel_id": "",
                    "OS-EXT-SRV-ATTR:launch_index": 0,
                    "OS-EXT-SRV-ATTR:ramdisk_id": "",
                    "OS-EXT-SRV-ATTR:reservation_id": "r-t61j9da6",
                    "OS-EXT-SRV-ATTR:root_device_name": "/dev/sda",
                    "OS-EXT-SRV-ATTR:user_data": "IyEvYmluL2Jhc2gKL2Jpbi9zdQplY2hvICJJIGFtIGluIHlvdSEiCg==",
                    "OS-EXT-STS:power_state": 1,
                    "OS-EXT-STS:task_state": null,
                    "OS-EXT-STS:vm_state": "active",
                    "OS-SRV-USG:launched_at": "2019-04-23T15:19:10.855016",
                    "OS-SRV-USG:terminated_at": null,
                    "accessIPv4": "1.6.345346.3.4",
                    "accessIPv6": "80fe::",
                    "addresses": {
                        "private": [
                            {
                                "OS-EXT-IPS-MAC:mac_addr": "00:0c:29:0d:11:74",
                                "OS-EXT-IPS:type": "fixed",
                                "addr": "192.168.1.30",
                                "version": 4
                            }
                        ]
                    },
                    "config_drive": "",
                    "created": "2019-04-23T15:19:09Z",
                    "description": "teryretersy  descripton",
                    "flavor": {
                        "disk": 1,
                        "ephemeral": 0,
                        "extra_specs": {},
                        "original_name": "c45.bugger",
                        "ram": 512,
                        "swap": 0,
                        "vcpus": 1
                    },
                    "hostId": "543643q65467886543",
                    "host_status": "DOWN",
                    "id": "0afwqrwte--wqr-qwr98e991cecc",
                    "image": {
                        "id": "sdasfsaf-31e7-49b7-b260-868f441e862b",
                        "links": [
                            {
                                "href": "http://openstack.example.com/6f70656e737461636b20342065766572/images/70a599e0-31e7-49b7-b260-868f441e862b",
                                "rel": "bookmark"
                            }
                        ]
                    },
                    "key_name": null,
                    "links": [
                        {
                            "href": "http://openstack.example.com/v2.1/6f70656e737461636b20342065766572/servers/0e12087a-7c87-476a-8f84-7398e991cecc",
                            "rel": "self"
                        },
                        {
                            "href": "http://openstack.example.com/6f70656e737461636b20342065766572/servers/0e12087a-7c87-476a-8f84-7398e991cecc",
                            "rel": "bookmark"
                        }
                    ],
                    "locked": false,
                    "metadata": {
                        "My Server Name": "NGinx"
                    },
                    "name": "new-server-test",
                    "os-extended-volumes:volumes_attached": [],
                    "progress": 0,
                    "security_groups": [
                        {
                            "name": "default"
                        }
                    ],
                    "server_groups": [],
                    "status": "ACTIVE",
                    "tags": [],
                    "tenant_id": "asdasffsafasdsadsad",
                    "trusted_image_certificates": null,
                    "updated": "2019-04-23T15:19:11Z",
                    "user_id": "fake"
            }
            ],
            servers_details:[],
            servers:[],
            current:0,
            search_name:"",
            search_id:"",
    }),
    methods: {
        info(value,prop) {
            this.current = value;
            console.log(prop)
            // CANT DO THIS YET
            // this.getServerDetails(prop.list.id);
        },
        getServerDetails(){
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/servers/details',
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                console.log("Got them server details");
                console.log(response);
                this.servers_details = response.data.servers;
            }).catch(error => {
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
        toggleUp(index){
            console.log("togle")
            console.log(index)
            console.log(this.upHere)
            this.upHere[index]=='0'?'1':'0';
        },
    },
    computed: {
        filteredServerNames() {
            console.log("filtering server names")
            var search_for_name = this.search_name;
            var arrayNames = this.servers_dummy.map(({ name }) => name);
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
            console.log("filtering servers")
            var search_for_name = this.search_name;
            var search_for_id = this.search_id;
			if(search_for_name === "") {
                if(search_for_id === ""){
                    return this.servers_dummy;
                } else{
                   return this.servers_dummy.filter(function(server) {
                        return server.id ===search_for_id;
                        }
                   )}
                } else {
				return this.servers_dummy.filter(function(server) {
                    var regex = new RegExp(search_for_name, 'gi');
                    var boolean = server.name.match(regex) === null ? false:true;
                    if(search_for_id === ""){
                        return boolean;
                    } else{
                        return boolean && server.id === search_for_id;
                    }
				});
			}
		}
    },
    mounted(){
        this.server_name_list = this.servers_dummy.map(({ name }) => name)
    }
}
</script>

<style>
.up {
    transition: 0.25s ease-in;
    transform: translateY(-5px);
}
</style>