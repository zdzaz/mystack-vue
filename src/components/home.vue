<template>
<section class="hero is-light is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        Dashboard
      </h1>
    </div>
  </div>
</section>
    <!-- <div class="tile is-ancestor">
      <div class="tile is-vertical">
        <div class="tile">
          <div class="tile is-parent is-vertical" style="text-align: center">
            <article class="tile is-child notification is-light">
              <p class="title">Dashboard</p>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-info">
              <p class="title">Middle tile</p>
              <p class="subtitle">With an image</p>
              <figure class="image is-4by3">
                <img src="https://bulma.io/images/placeholders/640x480.png">
              </figure>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-light">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">
               Content -->
            <!-- </div>
          </article>
        </div>
      </div>
      
    </div> -->
    
</template>

<script>
export default {
  name: 'home',
  props:[
    'ip'
  ],
  data: () => ({
  }),
  methods:{
    connect(){
      //Call OpenStack, connect to OpenStack Machine
      //if all went well, keep going, else error message
      this.router.push("/home");
    },
  },
}
</script>

