<template>
    <span>
        <span v-if="!loading">
            <section class="hero is-light is-bold">
                <div class="hero-body">
                    <div class="container">
                    <h1 class="title">
                        Volumes
                    </h1>
                    </div>
                </div>
            </section>
            <section>
                <div class="container" style="padding-top:30px;">
                    <section class="columns">
                        <b-field  label="Filter by name" label-position='on-border' class="column">
                            <b-input type="number" v-model="search_size"/>
                        </b-field>
                        <b-field label="Filter by ID" label-position='on-border' class="column">
                            <b-input v-model="search_id"/>
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
                            <i class="fas fa-question is-dark" @click="alert"></i>

                    </section>
                    <section>
                        <b-table
                            @dblclick="toggleEditVolume=true"
                            :selected.sync="selected"
                            focusable
                            paginated
                            :per-page="perPage"
                            :current-page.sync="currentPage"
                            :data="filteredVolumes"
                            :columns="columns">
                        </b-table>
                    </section>
                    <b-modal :active.sync="toggleEditVolume"
                        has-modal-card
                        trap-focus
                        aria-role="dialog"
                        aria-modal>
                        <div v-if="toggleEditVolume" class="card">
                            <header class="modal-card-head">
                                <div class="columns">
                                    <div class="column">
                                        <b class="is-size-4	">Allocate Space for Volume {{this.selected.name==''?this.selected.id:this.selected.name}}</b> 
                                    </div>
                                </div>
                            </header>
                            <section class="card-content columns">
                                <span class="column has-text-right">Increase to</span>
                                <b-input class="column is-one-fifth" type="number" v-model="allocateSize" :placeholder="selected.size+10"></b-input>
                                <span class="column has-text-left">GB size</span>
                            </section>
                            <footer class="modal-card-foot">
                                <div class="has-text-right" style="padding-right:30px;padding-top:30px">
                                    <button class="button" type="button" @click="toggleEditVolume=false">Close</button>
                                    <button  class="button is-warning"  @click.prevent.stop="editVolume()">Allocate more {{allocatedDifference}} GB</button>
                                </div>
                            </footer>
                        </div>
                    </b-modal>
                </div>
            </section>
        </span>
        <span v-else>
             <img class="loading" src="../../assets/loading.png">
        </span>
    </span>
        
        
</template>

<script>
export default {
    name: 'index',
    props:[
        'volumes',
        'ip',
        'user'
    ],
    data: () => ({
        selected:null,
        loading:false,
        toggleEditVolume:false,
        perPage:10,
        currentPage:1,
        columns: [
            {
                field: 'id',
                label: 'ID',
            },
            {
                field: 'name',
                label: 'Name',
            },
            {
                field: 'size',
                label: 'Size',

            },
            {
                field: 'bootable',
                label: 'Bootable',

            },
            {
                field: 'volume_image_metadata.image_name',
                label: 'Image',

            },
            {
                field: 'status',
                label: 'Status',
            },
            {
                field: 'availability_zone',
                label: 'Zone',
            },
            {
                field: 'description',
                label: 'Description',
            },
            
        ],
        search_size:'',
        search_id:'',
        allocateSize:5,
    }),
    methods: {
        selectedToNull(){
            this.selected=null;
        },
        editVolume(){
            
            this.loading = true;
            this.toggleEditVolume = false;
            var data = {};
            data = {
                "os-extend": {
                    "new_size": this.allocateSize
                }
            }

            if(this.allocatedDifference<=0){
                this.loading = false;
                this.$toasted.error("Allocate a bigger size volume, not smaller", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
                return;
            }

            this.axios.post('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/volume/v3/'+this.user.project.id+'/volumes/'+this.selected.id+'/action',data,
            {
                headers: { 
                    'x-auth-token': this.user.token
                }
            }).then(response => {
                console.log(response)
                this.loading = false;
                this.$emit('getVolumesAgain');
            }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not edit volume", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                });
                    this.loading = false;
            });
        },
        alert() {
            this.$buefy.dialog.alert('Double click a table entry to edit volume')
        },
    },
    computed: {
        allocatedDifference(){
            return this.allocateSize-this.selected.size;
        },
        filteredVolumes() {
            var search_for_size = this.search_size;
            var search_for_id = this.search_id;
            
            var filtered = this.volumes;

            if(search_for_size!==''){
                filtered = filtered.filter(function(f) {
                    return f.size==search_for_size;
                });
            }

            if(search_for_id!==''){
                filtered = filtered.filter(function(f) {
                    return f.id === search_for_id;
                });
            }


            return filtered;
		},
        
    },
    mounted(){
    }
}
</script>

<style>
    .highlight0 {
        background:#bbb8ba48;
    }
</style>