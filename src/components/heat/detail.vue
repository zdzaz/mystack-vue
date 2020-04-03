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
        selected:null,
        stacks:[],
        perPage:10,
        currentPage:1,
        columns: [
            {
                field: 'stack_name',
                label: 'Name',

            },
            {
                field: 'description',
                label: 'Description',

            },
            {
                field: 'stack_status',
                label: 'Status',

            },
            {
                field: 'stack_status_reason',
                label: 'Status Reason',

            },
            {
                field: 'creation_time',
                label: 'Created',

            },
            {
                field: 'updated_time',
                label: 'Updated',

            },
            {
                field: 'deletion_time',
                label: 'Deleted',

            },
        ],
        search_name:'',
      
    }),
    methods: {
        selectedToNull(){
            this.selected=null;
        },
        goTo(stack_id){
            this.$router.push("/home/stacks/"+stack_id);
        },
        getResources(){
            this.loading = true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks/'+this.$router.params.name+'/'+this.$router.params.id+'/resources',
                {
                    headers: { 
                        'x-auth-token': this.user.token
                    }
                }).then(response => {
                    this.stacks = response.data.stacks;
                    this.loading = false;
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
        // this.getResources();
    }
}
</script>

<style>
    .highlight0 {
        background:#bbb8ba48;
    }
</style>