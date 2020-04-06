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
                </section>
                <section>
                    <b-table
                        :selected.sync="selected"
                        @dblclick="goTo(selected.id,selected.stack_name)"
                        focusable
                        paginated
                        :per-page="perPage"
                        :current-page.sync="currentPage"
                        :data="filteredStacks"
                        :columns="columns">
                    </b-table>
                </section>
             </div>
        </section>
        <!-- <section v-if="selected">
            <div class="container highlight0" style="padding-top:30px; padding-left:30px; padding-bottom:30px">
                <b> {{selected.name}} </b>
                <div class="columns">
                    <b-field style="padding-top:30px" label="Hardware Model" label-position='' class="column">
                        {{selected.hw_rng_model}}
                    </b-field>
                    <b-field style="padding-top:30px" label="Disk Format" label-position='' class="column">
                        {{selected.disk_format}}
                    </b-field>
                    <b-field style="padding-top:30px" label="Container Format" label-position='' class="column">
                        {{selected.container_format}}
                    </b-field>
                    <b-field style="padding-top:30px" label="Minimum Disk" label-position='' class="column">
                        {{selected.min_disk}}
                    </b-field>
                    <b-field style="padding-top:30px" label="Minimum RAM" label-position='' class="column">
                        {{selected.min_ram}}
                    </b-field>
                </div>
                <div class="columns">
                    <b-field style="padding-top:30px" label="Visibility" label-position='' class="column">
                        {{selected.visibility}}
                    </b-field>
                    <b-field style="padding-top:30px" label="Protected?" label-position='' class="column">
                        {{selected.protected==false?'No':'Yes'}}
                    </b-field>
                    <b-field style="padding-top:30px" label="OS Hidden?" label-position='' class="column">
                        {{selected.os_hidden==false?'No':'Yes'}}
                    </b-field>
                    <b-field style="padding-top:30px" label="OS Hash Algorithm" label-position='' class="column">
                        {{selected.os_hash_algo}}
                    </b-field> 
                    <b-field style="padding-top:30px" label="Checksum" label-position='' class="column">
                        {{selected.checksum}}
                    </b-field>
                         
                </div>
                <div style="padding-top:30px">
                    <button class="button block" @click="showHash = !showHash">Toggle OS Hash Value</button>
                    <b-field v-show="showHash" >
                        {{selected.os_hash_value}}
                    </b-field>
                    
                </div>
                <div style="padding-top:30px">
                    <button class="button block" @click="showOwner = !showOwner">Toggle Owner ID</button>
                    <b-field v-show="showOwner" >
                        {{selected.owner}}
                    </b-field>
                    
                </div>
             </div>
        </section> -->
        
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