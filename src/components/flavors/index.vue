<template>
    <span>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Flavors
                </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" style="padding-top:30px;">
                <section class="columns">
                    <b-field label="Filter by name" label-position='on-border' class="column">
                        <b-input v-model="search_name"/>
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
                </section>
                <section>
                    <b-table
                        :selected.sync="selected"
                        focusable
                        paginated
                        :per-page="perPage"
                        :current-page.sync="currentPage"
                        :data="filteredFlavors"
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
        'flavors',
        'ip',
        'user'
    ],
    data: () => ({
        selected:null,
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
                field: 'ram',
                label: 'RAM',

            },
            {
                field: 'swap',
                label: 'Swap',

            },
            {
                field: 'disk',
                label: 'Disk',

            },
            {
                field: 'vcpus',
                label: 'VCPUs',

            },
            {
                field: 'os-flavor-access:is_public',
                label: 'Access',

            },
            {
                field: 'rxtx_factor',
                label: 'rxtx_factor',
            },
            
        ],
        search_name:'',
        search_id:'',
    }),
    methods: {
        selectedToNull(){
            this.selected=null;
        }
    },
    computed: {
        filteredFlavors() {
            var search_for_name = this.search_name;
            var search_for_id = this.search_id;
            
            var filtered = this.flavors;

            if(search_for_name!==''){
                filtered = filtered.filter(function(f) {
                    return f.name.includes(search_for_name);
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