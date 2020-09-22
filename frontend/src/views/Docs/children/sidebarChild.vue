<template>
    <div class="sub__section" style="padding-left:20px">
        <transition-group name="sidebar-list" tag="ul" class="nav flex-column">
            <li class="nav-item" v-for="module in children" :key="module.title">
                <a
                    class="nav-link collapsable"
                    :class="{'collapsed' : selectedTabs.indexOf(module.title) != -1}"
                    @click="selectedTabs.indexOf(module.title) == -1 ?
                    selectedTabs.push(module.title) :
                    selectedTabs.splice(selectedTabs.indexOf(module.title), 1)"
                >
                    <div :style="[!module.children ? {'padding-left':'15px'} : {}]">
                        <i class="fas fa-caret-down" v-if="module.children"></i>
                        {{ module.title }}
                    </div>
                </a>
                <transition name="sub__section" mode="out-in" v-if="module.children">
                    <side-child
                        v-if="selectedTabs.indexOf(module.title) != -1"
                        name="sub__section"
                        :children="module.children"
                    ></side-child>
                </transition>
            </li>
        </transition-group>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                test : false,
                selectedTabs : [],
            }
        },
        name:'sideChild',
        props:['variable', 'children'],
        mounted () {

        },
        methods : {

        }
    }
</script>

<style>
    .sub__section .nav .nav-item {
        font-family: "Google Sans", "Roboto", sans-serif;
    }

    .sub__section .nav-link {
        padding: 0.25rem 0;
        position: relative;
        color: inherit;
    }

    .sub__section .nav .nav-item .nav-link {
        padding: 0 0 0.5rem 0;
        align-items: flex-end;
        display: flex;
        justify-content: space-between;
    }

    /* .sub__section .nav .nav-item .nav-link::after {
        content: "\f007";
        font-family: "FontAwesome";
        font-weight: normal;
    } */

    .nav-link:hover, .nav-link:focus{
        text-decoration: none;
        cursor:pointer;
    }

    .nav .nav-item .nav-link.collapsable .fas{
        transition: transform .25s ease-in-out;
    }

    .nav .nav-item .nav-link.collapsable:not(.collapsed) .fas{
        transform: rotate(-90deg);
    }
</style>

<style scoped>
    .sub__section {
        position: relative;
        overflow:hidden;
        transition: height 0.35s ease;
    }

    .sub__section-enter-active, .sub__section-leave-active {
        transition: all .25s;
    }
    .sub__section-enter, .sub__section-leave-to {
        transform: translateX(-100%);
    }

    .sidebar-list-move{
        transition:transform .25s;
    }
</style>