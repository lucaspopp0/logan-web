<template>
  <div class="hello">
    
  </div>
</template>

<script>
import DataManager from '../data-manager'

export default {
  name: 'hello',
  data () {
    return {}
  },
  mounted () {
    console.log(this.$refs);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
