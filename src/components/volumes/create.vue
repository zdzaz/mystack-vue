<template>
    <span>
    <span v-if="!loading">
        <template>
        <fab :actions="fabActions"
            @alert="createVolume"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Create Volumes
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
                                    <b-input v-model="volume.name" placeholder="my-new-volume (Optional)"></b-input>
                                </b-field>
                                <b-field label="Size" label-position='' class="column">
                                    <b-input v-model="volume.size" type="number" required></b-input>
                                </b-field>
                            </div>
                            <b-field label="Description"  label-position=''>
                                <b-input type="textarea" v-model="volume.description" placeholder="Insert a description for the new volume (Optional)" value=""></b-input>
                            </b-field>
                        </div>
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
                                    Bootable Volume
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
                                                    value="null"
                                                    >
                                                    Not Bootable
                                                </option>
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
                                                <div v-if="selectedImage!==null" class="">
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
                                                    </div>
                                                </div>
                                            </b-field>
                                        </span>
                                    </div>
                                </div>
                        </b-collapse>
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
        'volumes',
        'images',
    ],
    data: () => ({
        loading:false,
        isOpen: 0,
        index:0,
        fabActions: [
            {
                name: 'alert',
                icon: 'done_all'
            },
        ],
        volume:{},
        selectedImage:null,
    }),
    methods: {
        createVolume(){
            this.loading = true;

            if(this.selectedImage!=null){
                this.volume.imageRef = this.selectedImage.id;
            }

            var data = {};
            data = { "volume":this.volume };
            console.log(data)
            
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/volume/v3/'+this.user.project.id+'/volumes',data,
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                console.log(response)
                this.loading = false;
                this.$emit('getVolumesAgain');
                this.$router.push("/home/volumes")
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not create volume", { 
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
        
    },
    mounted(){

    }
}


// Para alterar o size do volume usei o endpoint -> http://"ip"/volume/v3/"project_id"/volumes/"Volume_id"/action e body

// {
//     "os-extend": {
//         "new_size": 2
//     }
// }


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
