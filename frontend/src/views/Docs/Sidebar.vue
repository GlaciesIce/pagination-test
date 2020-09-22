<template>
    <div class="site-sidebar" style="padding-left:20px">
        <transition-group name="sidebar-list" class="nav flex-column" tag="ul">
            <li class="nav-item" v-for="(module, index) in sideList" :key="module.title">
                <a
                    class="nav-link collapsable"
                    :class="{'collapsed' : selectedTabs.indexOf(module.title) != -1}"
                    @click="selectedTabs.indexOf(module.title) == -1 ?
                    selectedTabs.push(module.title) :
                    selectedTabs.splice(selectedTabs.indexOf(module.title), 1)"
                    style="background:white"
                    :style="{'z-index' : sideList.length+1}"
                >
                    <span class="section__title">{{ module.title }}</span>
                    <div v-if="module.children">
                        <i class="fas fa-angle-up"></i>
                    </div>
                </a>
                <transition name="sub__section" mode="out-in" v-if="module.children">
                    <side-child
                        v-if="selectedTabs.indexOf(module.title) != -1"
                        name="sub__section"
                        :children="module.children"
                        style="display: block; background-color: white;"
                        :style="{'z-index' : sideList.length-index}"
                    ></side-child>
                </transition>
            </li>
            <!-- <li class="nav-item" v-for="module in sideList" :key="module.title">
                <a
                    class="nav-link"
                    :class="{'collapsed' : selectedTab == module.title}"
                    @click="selectedTab = selectedTab == module.title ? null : module.title"
                    style="z-index:1; background:white"
                >
                    <span class="section__title">{{ module.title }}</span>
                    <div v-if="module.children">
                        <i class="fas fa-angle-up"></i>
                    </div>
                </a>
                <transition name="sub__section" mode="out-in" v-if="module.children">
                    <side-child
                        v-if="selectedTab == module.title"
                        name="sub__section"
                        :children="module.children"
                    ></side-child>
                </transition>
            </li> -->
        </transition-group>
    </div>
</template>

<script>
    import sideList from  './children/sidebarList.json'

    import sideChild from './children/sidebarChild'

    export default {
        data () {
            return {
                sideList : sideList,
                test : false,
                selectedTab : '',
                selectedTabs : [],
            }
        },
        components : {
            sideChild,
        },
        mounted () {
            
        },
        methods : {

        }
    }
</script>

<style>
    .collapsing {
        position: relative;
        height: 0;
        overflow:hidden;
        transition: height 0.35s ease;
    }

    a:hover {
        color:#0263C2;
        text-decoration:underline;
    }
</style>

<style scoped>

    .site-sidebar .nav .nav-item {
        font-family: "Google Sans", "Roboto", sans-serif;
    }

    .site-sidebar .nav-link {
        padding: 0.25rem 0;
        position: relative;
        color: inherit;
    }

    .site-sidebar .nav .nav-item .nav-link {
        padding: 0.75rem 0;
        align-items: flex-end;
        display: flex;
        justify-content: space-between;
    }

    /* .site-sidebar .nav .nav-item .nav-link::after {
        content: "\f007";
        font-family: "FontAwesome";
        font-weight: normal;
    } */

    .nav-link:hover, .nav-link:focus{
        text-decoration: none;
        cursor:pointer;
    }

    .site-sidebar>.nav>.nav-item>.nav-link .fas {
        transition : transform .25s ease-in-out;
    }

    .site-sidebar>.nav>.nav-item>.nav-link:not(.collapsed) .fas {
        transform : rotate(180deg);
    }
    
    .section__title{
        font-size:20px;
    }

    .sub__section-enter-active, .sub__section-leave-active {
        transition: all .25s;
    }
    .sub__section-enter, .sub__section-leave-to {
        transform: translateY(-100%);
    }

    .sidebar-list-move{
        transition:transform .25s;
    }
</style>