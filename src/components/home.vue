<template>
  <span>
    <section class="hero is-light is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Dashboard
          </h1>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <template>
          <div>
            <apexchart width="500" :options="chartOptions" :series="series"></apexchart>
          </div>
        </template>
      </div>
    </section>
  </span>
</template>

<script>



export default {
  name: 'home',
  props:[
    'ip',
    'user'
  ],
  data: () => ({
    loading:false,
    quota_set:{},
    current:0,
    series: [44, 55, 67, 83],
          chartOptions: {
            chart: {
              height: 350,
              type: 'radialBar',
            },
            plotOptions: {
              radialBar: {
                dataLabels: {
                  name: {
                    fontSize: '22px',
                  },
                  value: {
                    fontSize: '16px',
                  },
                  total: {
                    show: true,
                    label: 'Total',
                  }
                }
              }
            },
            labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
            legend: {
              show: true,
              floating: false,
              fontSize: '16px',
              position: 'left',
              labels: {
                useSeriesColors: true,
              },
              formatter: function(seriesName, opts) {
                return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
              },
              itemMargin: {
                vertical: 3
                },
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                      show: false
                  }
                }
              }]
            },
  }),
  methods:{
    getQuotas(){
      this.loading = true;
      this.axios.get('http://'+this.ip[0]+'.'+this.ip[1]+'.'+this.ip[2]+'.'+this.ip[3]+'/compute/v2.1/os-quota-sets/'+this.user.project.id+'/detail',
        {
          headers: { 
              'x-auth-token': this.user.token
          }
        }).then(response => {
            this.quota_set = response.data.quota_set;
            this.loading = false;
        }).catch(error => {
            console.log(error)
            this.$toasted.error("No subnetworks associated!", { 
                theme: "outline", 
                position: "top-right", 
                duration : 5000
                });
                this.loading = false;
        });
    }
  },
  mounted(){
    this.getQuotas();
  },
}
</script>

