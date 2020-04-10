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
            <div class="container" style="padding-top:30px;">
                <section class="columns">
                    <b-field  label-position='on-border' class="column is-one-quarter">
                    </b-field>
                    <b-field label="Filter by name" label-position='on-border' class="column is-one-third">
                        <b-input v-model="search_name"/>
                    </b-field>
                    <!-- PER PAGE -->
                    <b-field label="Per Page" label-position='on-border' class="column">
                        <b-select v-model="perPage">
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="15">15 per page</option>
                            <option value="20">20 per page</option>
                        </b-select>
                    </b-field>
                    <b-field label="" class="column" style="align-content:right">
                        <button :disabled="checkedRows.length<=0" class="button is-danger"  @click.prevent.stop="bulkDelete()">Delete</button>
                    </b-field>
                </section>
                <section>
                    <b-table
                        :selected.sync="selected"
                        @dblclick="goTo(selected.id,selected.stack_name)"
                        focusable
                        checkable
                        checkbox-position="right"
                        :checked-rows.sync="checkedRows"
                        paginated
                        :per-page="perPage"
                        :current-page.sync="currentPage"
                        :data="filteredStacks"
                        :columns="columns">
                    </b-table>
                </section>
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
        selected:null,
        stacks:[],
        checkedRows:[],
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
            // {
            //     field: 'deletion_time',
            //     label: 'Deleted',

            // },
        ],
        search_name:'',
      
    }),
    methods: {
        bulkDelete(){
            this.loading = true;
            this.checkedRows.forEach(stack=>{
            this.axios.delete('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks/'+stack.stack_name+'/'+stack.id+'',
                {
                headers: { 
                    'x-auth-token': this.user.token
                }
                }).then((response) => {
                console.log(response)
                this.stacks = this.stacks.filter(s => s.id !== stack.id);
                this.loading = false;
                this.$toasted.success("Stack deleted with success", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                    });
                this.$forceUpdate();
                }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not delete Stack", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loading = false;
                });
                this.$forceUpdate();
            });
        },
        selectedToNull(){
            this.selected=null;
        },
        goTo(stack_id,stack_name){
            this.$router.push("/home/stacks/"+stack_name+"/"+stack_id);
        },
        getStacks(){
            this.loading = true;
            this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/heat-api/v1/'+this.user.project.id+'/stacks/detail',
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
        filteredStacks() {
            var search_for_name = this.search_name;
            
            var filtered = this.stacks;

            if(search_for_name!==''){
                filtered = filtered.filter(function(s) {
                    return s.stack_name.includes(search_for_name);
                });
            }
            return filtered;
		},
        
    },
    mounted(){
        this.getStacks();
    }
}
</script>

<style>
    .highlight0 {
        background:#bbb8ba48;
    }
</style>