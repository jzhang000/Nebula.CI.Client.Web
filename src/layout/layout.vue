<template>
 <div style="overFlow：auto">
    <a-row>
      <a-col :span="24" id='header'>
        <div id="logo">
          <a id="home-link" href='/' >
            <img src="/static/logo.png" id="head-icon">
            
          </a>
        </div>
        <div id="screenfull">
          <ScreenFull />
        </div>
        <div id="user">
          <HeaderUser />
        </div>
      </a-col>
    </a-row>
    <a-row id='navigation'>
      <Navigation />
    </a-row>
    <div id="main-body">
        <router-view/>
    </div>
  </div>
</template>

<script>
import HeaderUser from './components/header-user'
import Navigation from './components/navigation'
import ScreenFull from './components/fullscreen'
export default {
  components: {
    HeaderUser,
    Navigation,
    ScreenFull
  },
  data () {
    return {
     
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header {
    display: block;
    display: flex;
    align-items: center;
    height: 3.5rem;
    font-size: 1rem;
    font-size: var(--font-size-base);
    line-height: 1.5;
    line-height: var(--line-height-base);
    background-color: #000000;
}

#head-icon {
  height:3.5rem
}
#name-icon {
  margin-left: 0.25rem;
  width: 139px;
  height: 34px;
}

#logo {
    flex: 1;
    margin-left: 10px;
    display: inline-block;
    display: inline-flex;
    align-items: center;
    position: relative;
    height: 100%;
}

#screenfull{
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
}

#user {
    display: flex;
    align-items: center;
    margin-right: 0.75rem;
    padding-right: 40px;
}

#navigation {
    display: block;
    display: flex;
    align-items: center;
    height: 2.5rem;
    font-size: 1rem;
    line-height: 1.5;
    background-color: #F8F8F8;
}


</style>
