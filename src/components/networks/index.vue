<template>
    <span>
        <span v-if="!loading">
            <section class="hero is-light is-bold">
                <div class="hero-body">
                    <div class="container">
                    <h1 class="title">
                        Networks
                    </h1>
                    </div>
                </div>
            </section>
            <section>
                <div class="container" style="padding-top:30px;">
                    <section class="columns">
                        <b-field label="" class="column" style="align-content:right">
                        </b-field>
                        <b-field label="Filter by ID" label-position='on-border' class="column">
                            <b-input v-model="search_id"/>
                        </b-field>
                        <b-field  label="Filter by name" label-position='on-border' class="column">
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
                        </b-field>
                        <b-field label="" class="column" style="align-content:right">
                            <button :disabled="checkedRowsDelete.length<=0" class="button is-danger"  @click.prevent.stop="bulkDelete()">Delete</button>
                        </b-field>
                        <i class="fas fa-question is-dark" @click="alert"></i>
                    </section>
                    <section>
                        <b-table
                            :selected.sync="selected"
                            :checked-rows.sync="checkedRowsDelete"
                            checkbox-position="right"
                            checkable
                            focusable
                            paginated
                            :per-page="perPage"
                            :current-page.sync="currentPage"
                            :data="filteredNetworks"
                            :columns="columns">
                        </b-table>
                    </section>
                    
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
        'ip',
        'user',
        'networks'
    ],
    data: () => ({
        selected:null,
        checkedRowsDelete:[],
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
                field: 'mtu',
                label: 'MTU',

            },
            {
                field: 'shared',
                label: 'Shared',

            },
            {
                field: 'router:external',
                label: 'Router External',

            },
            {
                field: 'status',
                label: 'Status',
            },
        ],
        search_name:'',
        search_tags:'',
        search_id:'',
        search_status:'',
    }),
    methods: {
        bulkDelete(){
            this.$emit('bulkDeleteNetworks',this.checkedRowsDelete);
        },
        alert() {
            this.$buefy.dialog.alert('Double click a table entry to edit volume')
        },
    },
    computed: {
        filteredNetworks() {
            var search_for_name = this.search_name;
            var search_for_id = this.search_id;
            
            var filtered = this.networks;

            if(search_for_name!==''){
                filtered = filtered.filter(function(img) {
                    return img.name.includes(search_for_name);
                });
            }

            if(search_for_id!==''){
                filtered = filtered.filter(function(img) {
                    return img.id === search_for_id;
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