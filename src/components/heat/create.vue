<template>
    <span>
        <span v-if="!loading">
            <template>
            <fab :actions="fabActions"
                @alert="createStack"
            ></fab>
            </template>
            <section class="hero is-light is-bold">
                <div class="hero-body">
                    <div class="container">
                    <h1 class="title">
                        Create Stack
                    </h1>
                    </div>
                </div>
            </section>
            <section>
                <div class="container" style="padding-top:30px">
                    <!-- GERAL-->
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
                                
                                <b-switch
                                    v-model="fromTemplate"
                                    :true-value="true"
                                    :false-value="false"
                                    outlined
                                    type="is-primary"
                                    >Create Stack from Template <b>HOT</b></b-switch><i style="margin-left:10px;" class="fas fa-question is-dark" @click="alert"></i>
                                <span>
                                    <div class="content">
                                        <div style="margin-top:30px" class="columns">
                                            <b-field label="Stack Name" label-position='' class="column">
                                                <b-input v-model="newStack.stack_name" placeholder="my-new-stack" required></b-input>
                                            </b-field>
                                            <b-field v-if="!fromTemplate" label="HOT Version" label-position='' class="column">
                                                <b-input  v-model="newStack.heat_template_version" placeholder="2013-05-23" disabled></b-input>
                                            </b-field>
                                            <b-field label="Parameter flavor pick" label-position='' class="column is-one-third" >
                                                <b-select placeholder="Select a flavor" v-model="newStack.parameterFlavor" expanded required>
                                                    <option
                                                        v-for="flavor in flavors"
                                                        :value="flavor.name"
                                                        :key="flavor.id"
                                                        >
                                                        {{ flavor.name }}
                                                    </option>
                                                </b-select>
                                            </b-field>
                                            
                                        </div>
                                        <b-field type="is-success" class=" ">
                                            <b-radio-button  type="is-success" v-model="newStack.disable_rollback"
                                                native-value='false'
                                                >
                                                Enable Rollback
                                            </b-radio-button>
                                            <b-radio-button  type="is-danger" v-model="newStack.disable_rollback"
                                                native-value='true'>
                                                Disable Rollback
                                            </b-radio-button>
                                        </b-field>
                                        <b-field label="Description"  label-position=''>
                                            <b-input type="textarea" v-model="newStack.description" placeholder="Insert a description for the new stack" value=""></b-input>
                                        </b-field>
                                    </div>
                                    <!-- RESOURCES -->
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
                                                {{fromTemplate?'Template':'Resources'}}
                                            </p>
                                            <a class="card-header-icon">
                                                <b-icon
                                                    :icon="props.open ? 'menu-down' : 'menu-up'">
                                                </b-icon>
                                            </a>
                                        </div>
                                        <!-- Requirements OPTIONS -->
                                        <span v-if="!fromTemplate">
                                        <div class="card-content">
                                            <!-- OS::Nova::Server -->
                                                <div class="column" >
                                                    <b-button @click="server_count = server_count+1" class="button is-dark " extended>
                                                        Add Server +
                                                    </b-button>
                                                    <b-button @click="volume_count = volume_count+1" style="margin-left:10px" class="button is-dark " extended>
                                                        Add Volume +
                                                    </b-button>
                                                </div>
                                            <div class="content">
                                                <div>
                                                    <div v-for="(s,index) in server_count" :key="s">
                                                        <div class="columns">
                                                            <b-field label="Server Name" label-position='' class="column">
                                                                <b-input v-model="servers_name[index]" placeholder="server-from-stack" required></b-input>
                                                            </b-field>
                                                            <b-field label="Flavor pick" label-position='' class="column is-one-third" >
                                                                <b-select placeholder="Select a flavor" v-model="selectedFlavor[index]" expanded required>
                                                                    <option
                                                                        v-for="flavor in flavors"
                                                                        :value="flavor.name"
                                                                        :key="flavor.id"
                                                                        >
                                                                        {{ flavor.name }}
                                                                    </option>
                                                                </b-select>
                                                            </b-field>
                                                            <b-field label="Image pick" label-position='' class="column" >
                                                                <b-select placeholder="Select a image" v-model="selectedImage[index]" expanded required>
                                                                    <option
                                                                        v-for="image in images"
                                                                        :value="image.id"
                                                                        :key="image.id"
                                                                        >
                                                                        {{ image.name }}
                                                                    </option>
                                                                </b-select>
                                                            </b-field>
                                                            <b-field label="Network pick" label-position='' class="column " >
                                                                <b-select placeholder="Select a flavor" v-model="selectedNetwork[index]" expanded required>
                                                                    <option
                                                                        v-for="network in networks"
                                                                        :value="network.id"
                                                                        :key="network.id"
                                                                        >
                                                                        {{ network.name }}
                                                                    </option>
                                                                </b-select>
                                                            </b-field>
                                                            <b-field label="Remove Resource" label-position='' class="column">
                                                                <b-button class="button is-danger" @click="server_count = server_count-1; selectedNetwork.splice(index, 1);selectedFlavor.splice(index, 1);selectedImage.splice(index, 1);servers_name.splice(index, 1);">X</b-button>
                                                            </b-field>
                                                        </div>
                                                    </div>
                                                    <hr v-show="volume_count">
                                                    <div  v-for="(v,index) in volume_count" :key="v+600">
                                                        <div class="columns">
                                                            <b-field label="Volume Name" label-position='' class="column">
                                                                <b-input required v-model="volumes_name[index]" placeholder="volume-from-stack"></b-input>
                                                            </b-field>
                                                            <b-field label="Volume Size" label-position='' class="column">
                                                                <b-input required v-model="volume_size[index]" placeholder="1"></b-input>
                                                            </b-field>
                                                            <b-field label="Remove Resource" label-position='' class="column is-one-fifth">
                                                                <b-button class="button is-danger" @click="volume_count = volume_count-1; volume_size.splice(index, 1);volumes_name.splice(index, 1);">X</b-button>
                                                            </b-field>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </span>
                                        <span v-else>
                                            <div class="card-content">
                                                <div class="columns">
                                                    <b-field style="padding-top:45px" label="" class="file column">
                                                        <b-upload v-model="templateFile" type="file" id="files" ref="files" @change="handleFileUpload()">
                                                            <a class="button is-dark">
                                                                <b-icon icon="upload"></b-icon>
                                                                <span>Click to upload File</span>
                                                            </a>
                                                        </b-upload>
                                                        <span class="file-name" v-if="templateFile">
                                                            {{ templateFile.name }}
                                                        </span>
                                                    </b-field>
                                                    <div class="column is-two-thirds">
                                                        <b-field  label-position=''>
                                                            <b-input  type="textarea" v-model="hotemplate" placeholder="Paste the HOT text here as JSON or YML" value=""></b-input>
                                                        </b-field>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    </b-collapse>
                                </span>
                            
                        </div>
                    </b-collapse>
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
    ],
    data: () => ({
        loading:false,
        fromTemplate:false,
        hotemplate:"",
        templateFile:null,
        isOpen: 0,
        index:0,
        file:'',
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
        json:'',
        newStack:{},
        server_count:0,
        volume_count:0,
        resources:{},
        selectedFlavor:[],
        selectedImage:[],
        selectedNetwork:[],
        servers_name:[],
        volumes_name:[],
        volume_size:[],
    }),
    methods: {
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },
        createStackFromTemplate(data){
            this.loading = true;

            if(this.hotemplate){
                data.template = this.hotemplate;
            } else{
                console.log(this.templateFile)
                data.template_url = this.templateFile;
            }

            

            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks',data,
            {
                headers: { 
                    'x-auth-token': this.user.token,
                }
            }).then(() => {
                    this.$router.push("/home/stacks");
                    this.loading = false
                    this.$toasted.success("Stack created", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000 });
            }).catch(response => {
                console.log(response);
                var error_message = "Somethign went wrong trying to create stack...";
                if(response == "Error: Request failed with status code 401"){
                    error_message = "Invalid credentials..."
                }
                this.error(error_message);
                this.loading = false;
            });
        },
        createStack(){
            this.loading = true;
            var data = {};
            data.files={};
            data.disable_rollback=this.newStack.disable_rollback==undefined?'true':this.newStack.disable_rollback;
            data.parameters={
                "flavor":this.newStack.parameterFlavor
            };
            data.stack_name = this.newStack.stack_name;
            data.timeout_mins = "60";

            if(this.fromTemplate){
                this.createStackFromTemplate(data);
                return;
            }

            data.template={
                "heat_template_version":"2013-05-23", // hard coded
                "description":this.newStack.description,
                "parameters": {
                    "flavor": {
                        "default": this.newStack.parameterFlavor,
                        "type": "string"
                    }
                },
            }

            data.template.resources = {};

            for (let index = 0; index < this.server_count; index++) {
                
               data.template.resources[this.servers_name[index]]={
                    "type": "OS::Nova::Server",
                        "properties": {
                            // "key_name": "heat_key",
                            "flavor": {
                                "get_param": "flavor"
                            },
                            "image": this.selectedImage[index],
                            "user_data": "#!/bin/bash -xv\necho \"hello world\" &gt; /root/hello-world.txt\n",
                            "networks":[{
                            "network": this.selectedNetwork[index]
                        }]
                    }
               }
                
            }

            for (let index = 0; index < this.volume_count; index++) {
                
               data.template.resources[this.volumes_name[index]]={
                    "type": "OS::Cinder::Volume",
                        "properties": {
                            "availability_zone": "nova", //Hard coded
                            "volume_type": "62542c03-bf37-4932-a928-39107cb0769e", //Hard coded
                            "size": this.volume_size[index],
                            "name": this.volumes_name[index]
                        }
               }
                
            }


            

            console.log(data)

            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks',data,
            {
                headers: { 
                    'x-auth-token': this.user.token,
                }
            }).then(response => {
                    console.log(response);
                    this.loading = false
            }).catch(response => {
                console.log(response);
                var error_message = "Somethign went wrong trying to create stack...";
                if(response == "Error: Request failed with status code 401"){
                    error_message = "Invalid credentials..."
                }
                this.error(error_message);
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
        alert() {
            this.$buefy.dialog.alert('There is the option to create a stack from your own HOT - Heat Orchestration Template')
        },
        
    },
    computed: {
        
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