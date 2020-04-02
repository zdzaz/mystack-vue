<template>
    <span>
        <template>
        <fab :actions="fabActions"
            @alert="createProject"
        ></fab>
        </template>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Create Project
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
                                <b-field label="Project Name" label-position='' class="column">
                                    <b-input v-model="newProject.name" placeholder="new-project" required></b-input>
                                </b-field>
                                <b-field label="Select a Domain" label-position='' class="column">
                                    <b-select placeholder="Select a Format" v-model="newProject.domain_id" disabled expanded>
                                        <option
                                            v-for="format in disk_formats"
                                            :value="format.id"
                                            :key="format.id"
                                            >
                                            {{ format.label }}
                                        </option>
                                    </b-select>
                                </b-field>
                            </div>

                            <b-field label="Description"  label-position=''>
                                <b-input type="textarea" v-model="newProject.description" placeholder="Insert a description for the new project" value=""></b-input>
                            </b-field>
                        </div>      
                        
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
        newProject:{},
        
    }),
    methods: {
        createProject(){
            this.loading = true;
            // LOCATION HEADER to send file?
            //dont have permissions to create image owner none

            this.newProject.domain_id = "default";
            this.newProject.enabled = true;
            this.newProject.is_domain = false;

            var data = {
                "project": this.newProject
            }

            console.log(data)
            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/identity/v3/projects',data,
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(() => {
                this.$emit('getProjectsAgain');
                this.$toasted.success("Project created!", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
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