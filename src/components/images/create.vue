<template>
    <span>
        <template>
        <fab :actions="fabActions"
            @alert="createImage"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Create Image
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
                                    <b-input v-model="newImage.name" placeholder="my-new-img" required></b-input>
                                </b-field>
                                <b-field label="Select a Format" label-position='' class="column">
                                    <b-select placeholder="Select a Format" v-model="newImage.selectedDiskFormat" expanded>
                                        <option
                                            v-for="format in disk_formats"
                                            :value="format.id"
                                            :key="format.id"
                                            >
                                            {{ format.label }}
                                        </option>
                                    </b-select>
                                </b-field>
                                <b-field style="padding-top:45px" label="" class="file column is-one-fifth">
                                    <b-upload v-model="newImage.selectedFile" type="file" id="files" ref="files" @change="handleFileUpload()">
                                        <a class="button is-dark">
                                            <b-icon icon="upload"></b-icon>
                                            <span>Click to upload File</span>
                                        </a>
                                    </b-upload>
                                    <span class="file-name" v-if="newImage.selectedFile">
                                        {{ newImage.selectedFile.name }}
                                    </span>
                                </b-field>
                            </div>

                            <b-field label="Description"  label-position=''>
                                <b-input type="textarea" v-model="newImage.description" placeholder="Insert a description for the new image" value=""></b-input>
                            </b-field>
                        </div>
                        <!-- REQUIREMENTS -->
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
                                    Requirements & Security
                                </p>
                                <a class="card-header-icon">
                                    <b-icon
                                        :icon="props.open ? 'menu-down' : 'menu-up'">
                                    </b-icon>
                                </a>
                            </div>
                            <!-- Requirements OPTIONS -->
                            <div class="card-content">
                                <div class="content columns">
                                    <b-field label="Minimum RAM (MB)" label-position='' class="column is-one-quarter">
                                        <b-input type="number" placeholder="1024" v-model="newImage.min_ram"></b-input>
                                    </b-field>
                                    <b-field label="Minimum Disk (GB)" label-position='' class="column is-one-quarter">
                                        <b-input type="number" placeholder="10" v-model="newImage.min_disk"></b-input>
                                    </b-field>

                                    <b-field label="Visibility" label-position='' class="column is-one-quarter">
                                        <b-select placeholder="Select visibility" v-model="newImage.selectedVisibility" expanded>
                                            <option
                                                v-for="visibility in visibilities"
                                                :key="visibility"
                                                :value="visibility"
                                                >
                                                {{visibility}}
                                            </option>
                                        </b-select>
                                    </b-field>
                                    <b-field label="Protected" label-position='' class="column is-one-quarter">
                                        <b-select disabled placeholder="Select protection state" v-model="newImage.selectedProtection" expanded>
                                            <option
                                                value="true"
                                                >
                                                Yes
                                            </option>
                                            <option
                                                value="false"
                                                >
                                                No
                                            </option>
                                        </b-select>
                                    </b-field>
                                </div>
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
        file:'',
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
        json:'',
        newImage:{},
        visibilities:[
            'public',
            'private',
            'community',
            'shared',
        ],
        disk_formats:[
            {
                'id':'iso',
                'label':'ISO Image'
            },
            {
                'id':'raw',
                'label':'Raw Image'
            },
            {
                'id':'vdi',
                'label':'Virtual Disk Image'
            },
            {
                'id':'vhd',
                'label':'Virtual Hard Disk'
            },
        ]
    }),
    methods: {
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },
        createImage(){
            this.loading = true;

            // LOCATION HEADER to send file?
            //dont have permissions to create image owner none

            var data = { "image":{
                    'name':this.newImage.name,
                    'disk_format':this.newImage.selectedDiskFormat,
                    'container_format':'bare',
                    'min_ram':this.newImage.min_ram==''?0:Number(this.newImage.min_ram),
                    'min_disk':this.newImage.min_disk==''?0:Number(this.newImage.min_disk),
                    'visibility':this.newImage.selectedVisibility,
                    'description': this.newImage.description
                }
            }


            console.log(data)
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/image/v2/images',data.image,
            {
                headers: { 
                    'x-auth-token': this.user.token,
                }
            }).then(response => {
                    console.log(response.data.id);

                    var file = this.newImage.selectedFile;

                    this.axios.put('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/image/v2/images/'+response.data.id+'/file',file,
                    {
                        headers: { 
                            'x-auth-token': this.user.token,
                            'Content-Type': 'application/octet-stream',
                        }
                    }).then(response => {
                            console.log(response);
                            this.$emit('getImagesAgain');
                            this.$router.push("/home/images");

                    }).catch(response => {
                        console.log(response);
                        var error_message = "Somethign went wrong...";
                        if(response == "Error: Request failed with status code 401"){
                            error_message = "Invalid credentials..."
                        }
                        this.error(error_message);
                        this.loading = false;
                    });

            }).catch(response => {
                console.log(response);
                var error_message = "Somethign went wrong...";
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