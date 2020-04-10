<template>
    <span>
        <section class="hero is-light is-bold">
            <div class="hero-body">
                <div class="container">
                <h1 class="title">
                    Images
                </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" style="padding-top:30px;">
                <section class="columns">
                    <b-field type="" class="column">
                        <b-radio-button @click="selectedToNull()" type="is-dark" v-model="search_status"
                            native-value=''>
                            All
                        </b-radio-button>
                        <b-radio-button @click="selectedToNull()" type="is-dark" v-model="search_status"
                            native-value='active'
                            >
                            Active
                        </b-radio-button>
                        <b-radio-button @click="selectedToNull()" type="is-dark" v-model="search_status"
                            native-value='not-active'>
                            Not Active
                        </b-radio-button>
                    </b-field>
                    <b-field label="Filter by name" label-position='on-border' class="column">
                        <b-input v-model="search_name"/>
                    </b-field>
                    <b-field label="Filter by tag" label-position='on-border' class="column">
                        <b-input v-model="search_tags"/>
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
                    <b-field label="" class="column" style="align-content:right">
                        <button :disabled="checkedRows.length<=0" class="button is-danger"  @click.prevent.stop="bulkDelete()">Delete</button>
                    </b-field>
                </section>
                <section>
                    <b-table
                        :selected.sync="selected"
                        focusable
                        paginated
                        checkable
                        checkbox-position="right"
                        :checked-rows.sync="checkedRows"
                        :per-page="perPage"
                        :current-page.sync="currentPage"
                        :data="filteredImages"
                        :columns="columns">
                    </b-table>
                </section>
             </div>
        </section>
        <section v-if="selected">
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
        </section>
        
    </span>
        
</template>

<script>
export default {
    name: 'index',
    props:[
        'images',
        'ip',
        'user'
    ],
    data: () => ({
        selected:null,
        perPage:10,
        currentPage:1,
        showHash:false,
        showOwner:false,
        checkedRows:[],
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
                field: 'tags',
                label: 'Tags',

            },
            {
                field: 'status',
                label: 'Status',

            },
            {
                field: 'size',
                label: 'Size',

            },
            {
                field: 'virtual_size',
                label: 'Virtual Size',

            },
            {
                field: 'updated_at',
                label: 'Updated At',

            },
            {
                field: 'created_at',
                label: 'Created At',
            },
            
        ],
        search_name:'',
        search_tags:'',
        search_id:'',
        search_status:'',
    }),
    methods: {
        selectedToNull(){
            this.selected=null;
        },
        bulkDelete(){
            this.loading = true;
            this.checkedRows.forEach(img=>{
            this.axios.delete('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/image/v2/images/'+img.id+'',
                {
                headers: { 
                    'x-auth-token': this.user.token
                }
                }).then(() => {
                this.$emit("getImagesAgain");
                this.loading = false;
                this.$toasted.success("Image deleted with success", { 
                        theme: "outline", 
                        position: "top-right", 
                        duration : 5000
                    });
                }).catch(error => {
                console.log(error)
                this.$toasted.error("Could not delete Image", { 
                    theme: "outline", 
                    position: "top-right", 
                    duration : 5000
                    });
                    this.loading = false;
                });
                this.$forceUpdate();
            });
        }
    },
    computed: {
        filteredImages() {
            var search_for_name = this.search_name;
            var search_for_tag = this.search_tags;
            var search_for_id = this.search_id;
            var search_for_status = this.search_status;
            
            var filtered = this.images;

            if(search_for_name!==''){
                filtered = filtered.filter(function(img) {
                    return img.name.includes(search_for_name);
                });
            }

            if(search_for_tag!==''){
                filtered = filtered.filter(function(img) {
                    return img.tags.indexOf(search_for_tag) > -1;
                });
            }

            if(search_for_id!==''){
                filtered = filtered.filter(function(img) {
                    return img.id === search_for_id;
                });
            }

            if(search_for_status!==''){
                filtered = filtered.filter(function(img) {
                    return img.status === search_for_status;
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