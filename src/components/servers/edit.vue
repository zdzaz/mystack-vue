<template>
    <form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Edit Instance 
                </p>
                <b-field label="Name" class="">
                    <b-input type="text" v-model="edited.name" ></b-input>
                </b-field>
            </header>

            <section class="modal-card-body">
                <div class="columns">
                    <b-field label="Access IPv4" label-position='' class="column">
                        <b-input type="text" v-model="edited.accessIPv4"></b-input>
                    </b-field>
                    <b-field label="Access IPv6" label-position='' class="column">
                        <b-input type="text" v-model="edited.accessIPv6"></b-input>
                    </b-field>
                </div>
                <div class="columns">
                    <b-field label="Description" label-position='' class="column">
                        <b-input type="textarea" v-model="edited.description" placeholder="Edit the description"></b-input>
                    </b-field>
                </div>
                <div class="content">
                    <p><b>Disk Configuration</b></p>
                    <b-field label="" type="">
                        <b-radio-button type="is-info" v-model="edited['OS-DCF:diskConfig']"
                            native-value='AUTO'
                            >
                            Auto
                        </b-radio-button>
                        <b-radio-button type="is-info" v-model="edited['OS-DCF:diskConfig']"
                            native-value='MANUAL'>
                            Manual
                        </b-radio-button>
                    </b-field>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <button class="button is-warning"  @click.prevent.stop="editServer()">Edit</button>
            </footer>
        </div>
    </form>
</template>

<script>

export default {
    name: 'edit',
    props:[
        'server',
    ],
    data: () => ({
        edited:{},
    }),
    methods: {
        editServer(){
            console.log(this.edited)
            this.edited.id = this.server.id;
            this.$emit('editserverevent',this.edited);
            this.$parent.close()
        }
    },
    mounted(){
        this.edited =  Object.assign({}, this.server);
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