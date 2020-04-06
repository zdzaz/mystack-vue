<template>
    <span>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Heat Orchestration
                </h1>
                </div>
            </div>
        </section>
        <section>
           <div style="margin-top:30px" class="container">
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
                    <p class="card-header-title highlight6">
                        Resources
                    </p>
                    <a class="card-header-icon">
                        <b-icon
                            :icon="props.open ? 'menu-down' : 'menu-up'">
                        </b-icon>
                    </a>
                </div>
                <div class="card-content">
                    <div class="content columns">
                        <div v-for="resource in resources" :key="resource.resource_name" class="column is-one-fifth">
                            <div class="columns">
                                <img height="100" width="100" v-if="resource.resource_type=='OS::Nova::Server'" src="../../assets/OSNovaServer.png">
                                <img height="100" width="100" v-if="resource.resource_type=='OS::Cinder::Volume'" src="../../assets/OSCinderVolume.png">
                                <img height="100" width="100" v-else-if="resource.resource_type!='OS::Nova::Server'" src="../../assets/else.png">
                            </div>
                            <p>{{resource.resource_name}}</p>
                            <p>{{resource.resource_type}}</p>
                            <p>{{resource.creation_time}}</p>
                            <p>{{resource.resource_status}}</p>
                        </div>
                    </div>
                </div>
            </b-collapse>
           </div>
        </section>                
    </span>
        
</template>

<script>
export default {
    name: 'detail',
    props:[
        'ip',
        'user'
    ],
    data: () => ({
        resources:[],
        isOpen: 0,
        index:0,
          
    }),
    methods: {
        selectedToNull(){
            this.selected=null;
        },
        getResources(){
            this.loading = true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks/'+this.$route.params.name+'/'+this.$route.params.id+'/resources',
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {
                    this.resources = response.data.resources;
                    this.loading = false;
                    console.log(this.resources)

                }).catch(error => {
                    console.log(error)
                    this.$toasted.error("No stacks could be reached", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                        });
                        this.loading = false;
                });
            },
    },
    computed: {
        
    },
    mounted(){
        this.getResources();
    }
}
</script>

<style>
    .highlight0 {
        background:#bbb8ba48;
    }   
</style>